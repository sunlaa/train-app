import { Component, inject, OnInit } from '@angular/core';
import { DestroyService } from '@/core/services/destroy/destroy.service';
import {
  catchError,
  combineLatest,
  filter,
  map,
  of,
  switchMap,
  takeUntil,
} from 'rxjs';
import { StationsFacadeService } from '@/features/stations-management/services/stations-facade.service';
import { CarriagesFacadeService } from '@/features/carriages-management/services/carriages-facade.service';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { OrdersFacadeService } from '../../services/facade/orders-facade.service';
import handleOrderData from '../../utils/handleOrderData';
import { UsersService } from '../../services/users/users.service';
import { OrderItemComponent } from '../order-item/order-item.component';
import sortOrders from '../../utils/sortOrders';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [
    OrderItemComponent,
    SkeletonModule,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [DestroyService, ConfirmationService],
  templateUrl: './orders-page.component.html',
  styleUrl: './orders-page.component.scss',
})
export class OrdersPageComponent implements OnInit {
  private destroy$ = inject(DestroyService);

  private usersService = inject(UsersService);

  private ordersFacade = inject(OrdersFacadeService);

  private stationsFacade = inject(StationsFacadeService);

  private carriagesFacade = inject(CarriagesFacadeService);

  // TODO: Handle admin state
  public isAdmin = true;

  public isLoading = true;

  public orders: ReturnType<typeof handleOrderData>[] = [];

  ngOnInit(): void {
    this.initOrders();
  }

  private initOrders() {
    this.ordersFacade.load(this.isAdmin);
    combineLatest([
      this.ordersFacade.state$,
      this.stationsFacade.state$,
      this.carriagesFacade.state$,
    ])
      .pipe(
        takeUntil(this.destroy$),
        filter(
          ([o, s, c]) =>
            o.status !== 'loading' &&
            s.status !== 'loading' &&
            c.status !== 'loading',
        ),
        map(([o]) => {
          return o;
        }),
        switchMap((o) => {
          if (!this.isAdmin) return combineLatest([of(o.orders), of([])]);
          const users$ = this.usersService.getUsers().pipe(
            catchError(() => {
              return of([]);
            }),
          );
          return combineLatest([of(o.orders), users$]);
        }),
      )
      .subscribe(([orders, users]) => {
        this.isLoading = false;
        const unsortedOrders = orders.map((o) =>
          handleOrderData(
            o,
            this.stationsFacade.stationMap()!,
            this.carriagesFacade.carriageMap()!,
            users,
          ),
        );
        this.orders = sortOrders(unsortedOrders);
      });
  }
}
