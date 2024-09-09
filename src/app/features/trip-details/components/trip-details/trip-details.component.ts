import { DestroyService } from '@/core/services/destroy/destroy.service';
import {
  OccupiedSeat,
  RidePageData,
  SeatEventData,
  SelectedSeat,
} from '@/core/models/trip.model';
import { CarriagesFacadeService } from '@/features/carriages-management/services/carriages-facade.service';
import { StationsFacadeService } from '@/features/stations-management/services/stations-facade.service';
import { OrdersFacadeService } from '@/features/orders/services/facade/orders-facade.service';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { CarriageComponent } from '@/shared/components/carriage/carriage.component';
import { RideModalComponent } from '@/shared/components/ride-modal/ride-modal.component';
import { LoginFormComponent } from '@/features/auth/components/login-form/login-form.component';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ChipModule } from 'primeng/chip';
import { TabViewModule } from 'primeng/tabview';
import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  combineLatest,
  filter,
  map,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { NotificationService } from '@/shared/services/notification.service';
import { ProfileFacadeService } from '@/features/profile/services/profile-facade.service';
import { TripDetailsService } from '../../services/trip-details/trip.service';

@Component({
  selector: 'app-trip-details',
  standalone: true,
  imports: [
    ButtonModule,
    SkeletonModule,
    TabViewModule,
    PanelModule,
    ChipModule,
    ToastModule,
    DialogModule,
    DatePipe,
    CarriageComponent,
    RideModalComponent,
    CurrencyPipe,
    RouterLink,
    LoginFormComponent,
  ],
  providers: [DestroyService],
  templateUrl: './trip-details.component.html',
  styleUrl: './trip-details.component.scss',
})
export class TripDetailsComponent implements OnInit {
  private destroy$ = inject(DestroyService);

  private route = inject(ActivatedRoute);

  private stationsFacade = inject(StationsFacadeService);

  private carriagesFacade = inject(CarriagesFacadeService);

  private tripService = inject(TripDetailsService);

  private notification = inject(NotificationService);

  private ordersFacade = inject(OrdersFacadeService);

  private profileFacade = inject(ProfileFacadeService);

  // private routeParams: {
  //   rideId: number | null;
  //   fromId: number | null;
  //   toId: number | null;
  // } = { rideId: null, fromId: null, toId: null };

  private rideId: number | null = null;

  private fromId: number | null = null;

  private toId: number | null = null;

  private seatIndex: number | null = null;

  public fromCity: string = '';

  public toCity: string = '';

  public pageData: RidePageData | null = null;

  public selectedSeat: SelectedSeat | null = null;

  public occupiedSeat: OccupiedSeat | null = null;

  public selectedPrice: number | null = null;

  public tabIndex: number = 0;

  public modalVisible: boolean = false;

  public authModalVisible: boolean = false;

  public bookedModalVisible: boolean = false;

  ngOnInit() {
    combineLatest([this.route.paramMap, this.route.queryParamMap])
      .pipe(
        takeUntil(this.destroy$),
        tap(([params, query]) => {
          this.extractParams(params, query);
        }),
        switchMap(() => this.waitForLoading()),
        switchMap(() => this.loadRideDetails()),
      )
      .subscribe((data) => {
        this.pageData = data;
      });
  }

  private extractParams(params: ParamMap, query: ParamMap) {
    this.rideId = Number(params.get('rideId'));
    this.fromId = Number(query.get('from'));
    this.toId = Number(query.get('to'));
  }

  private waitForLoading() {
    return combineLatest([
      this.stationsFacade.state$,
      this.carriagesFacade.state$,
    ]).pipe(
      filter(
        ([stationState, carriageState]) =>
          stationState.status !== 'loading' &&
          carriageState.status !== 'loading',
      ),
      take(1),
      map(() => {}),
    );
  }

  private loadRideDetails() {
    const stationMap = this.stationsFacade.stationMap();
    const carriageMap = this.carriagesFacade.carriageMap();

    if (!stationMap || !carriageMap) {
      throw new Error('No station map or carriage map in store.');
    }

    if (!this.rideId || !this.fromId || !this.toId) {
      throw new Error(
        'One of the following data was not received: rideId, fromId, toId.',
      );
    }

    this.fromCity = stationMap[this.fromId].city;
    this.toCity = stationMap[this.toId].city;

    return this.tripService.getRideDetails(
      this.rideId,
      this.fromId,
      this.toId,
      carriageMap,
      stationMap,
    );
  }

  public openModal() {
    this.modalVisible = true;
  }

  public getSeat({ seat, carNumber, seatIndex }: SeatEventData) {
    this.selectedSeat = { seat, carNumber };

    this.selectedPrice =
      this.pageData?.carriageList[this.tabIndex].itemHeader.price ?? null;

    this.seatIndex = seatIndex;
  }

  public makeOrder() {
    if (!this.rideId || !this.seatIndex || !this.fromId || !this.toId) {
      throw Error('No order information.');
    }

    this.profileFacade.profile$.pipe(take(1)).subscribe(({ role }) => {
      if (role === 'guest') {
        this.authModalVisible = true;
        return;
      }

      this.ordersFacade.makeOrder({
        rideId: this.rideId!,
        seat: this.seatIndex!,
        stationStart: this.fromId!,
        stationEnd: this.toId!,
      });

      this.ordersFacade.state$
        .pipe(
          filter((state) => state.status !== 'loading'),
          take(1),
        )
        .subscribe((state) => {
          if (state.status === 'success') {
            this.notification.messageSuccess(
              'The seat was successfully booked.',
            );

            this.occupiedSeat = { ...this.selectedSeat! };
          }
          if (state.status === 'error') {
            if (state.error?.message === 'Ride is already booked') {
              this.bookedModalVisible = true;
              return;
            }
            this.notification.messageError(state.error?.message);
          }
        });
    });
  }
}
