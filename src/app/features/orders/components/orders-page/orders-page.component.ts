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
import { PaginatorModule } from 'primeng/paginator';
import { PageEvent } from '@/core/models/shared.model';
import { OrdersFacadeService } from '../../services/facade/orders-facade.service';
import handleOrderData from '../../utils/handleOrderData';
import { UsersService } from '../../services/users/users.service';
import { OrderItemComponent } from '../order-item/order-item.component';
import sortOrders from '../../utils/sortOrders';
import { ORDERS_PER_PAGE_OPTIONS } from '../../config/consts';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [
    OrderItemComponent,
    SkeletonModule,
    ToastModule,
    ConfirmDialogModule,
    PaginatorModule,
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

  public ordersPerPageOptions = ORDERS_PER_PAGE_OPTIONS;

  public offset: number = 0;

  public ordersPerPage: number = this.ordersPerPageOptions[0];

  public totalOrders: number = 0;

  private allOrders: ReturnType<typeof handleOrderData>[] = [];

  public pageOrders: ReturnType<typeof handleOrderData>[] = [];

  // TODO: Handle admin state
  public isAdmin = true;

  public isLoading = true;

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
        const ords = sortOrders(unsortedOrders);
        this.allOrders = ords;
        this.totalOrders = ords.length;
        this.updatePageRoutes();
      });
  }

  private updatePageRoutes() {
    this.pageOrders = this.allOrders.slice(
      this.offset,
      this.ordersPerPage + this.offset,
    );
  }

  public onPageChange(event: PageEvent) {
    this.offset = event.first ?? this.offset;
    this.ordersPerPage = event.rows ?? this.ordersPerPage;
    this.updatePageRoutes();
  }
}
