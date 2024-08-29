import { DestroyService } from '@/core/services/destroy/destroy.service';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, filter, take, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RidesState } from '@/redux/reducers';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { StationsFacadeService } from '@/features/stations-management/services/stations-facade.service';
import { CarriagesFacadeService } from '@/features/carriages-management/services/carriages-facade.service';
import { ButtonModule } from 'primeng/button';
import { TRouteRide } from '@/core/models/rides.model';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService } from 'primeng/api';
import { TStationListed } from '@/core/models/stations.model';
import { TCarriage } from '@/core/models/carriages.model';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NotificationService } from '@/shared/services/notification.service';
import { RidesFacadeService } from '../../services/rides-facade.service';
import { RideItemComponent } from '../ride-item/ride-item.component';
import { RideFormComponent } from '../ride-form/ride-form.component';
import { datesAreSequential } from '../../utils';

@Component({
  selector: 'app-rides-page',
  standalone: true,
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    RideItemComponent,
    ButtonModule,
    RideFormComponent,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [DestroyService, ConfirmationService],
  templateUrl: './rides-page.component.html',
  styleUrl: './rides-page.component.scss',
})
export class RidesPageComponent implements OnInit {
  private destroy$ = inject(DestroyService);

  private notificationService = inject(NotificationService);

  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  public ridesFacade = inject(RidesFacadeService);

  private stationsFacade = inject(StationsFacadeService);

  public stations: string[] = [];

  private carriagesFacade = inject(CarriagesFacadeService);

  public carriages: string[] = [];

  private routeId: number | undefined;

  public ridesState: RidesState | undefined;

  public formToggle = false;

  ngOnInit(): void {
    this.handleRouteParams();
    this.handleRidesState();
    this.loadInitialData();
  }

  private handleRouteParams() {
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.routeId = parseInt(params['routeId'], 10);
        if (Number.isNaN(this.routeId)) {
          this.setRidesStateError('Invalid route id', 'invalidRouteId');
        } else {
          this.ridesFacade.load(this.routeId);
        }
      });
  }

  private setRidesStateError(message: string, reason: string) {
    this.ridesState = {
      route: undefined,
      status: 'error',
      error: { message, reason },
    };
  }

  private handleRidesState() {
    this.ridesFacade.state$
      .pipe(
        takeUntil(this.destroy$),
        filter((state) => state.status !== 'loading'),
      )
      .subscribe((state) => {
        this.ridesState = state;
      });

    this.ridesFacade.state$
      .pipe(
        takeUntil(this.destroy$),
        filter((state) => state.status === 'success'),
        take(1),
      )
      .subscribe(() => {
        this.loadStationsAndCarriages();
      });
  }

  private loadStationsAndCarriages() {
    this.stationsFacade.load();
    this.carriagesFacade.load();
  }

  private loadInitialData() {
    combineLatest([
      this.stationsFacade.stations$.pipe(takeUntil(this.destroy$)),
      this.carriagesFacade.carriages$.pipe(takeUntil(this.destroy$)),
    ]).subscribe(([stations, carriages]) => {
      this.updateStationNames(stations);
      this.updateCarriageNames(carriages);
    });
  }

  private updateStationNames(stations: TStationListed[]) {
    if (this.ridesState?.route) {
      this.stations = this.ridesState.route.path.map((stationId) => {
        const foundStation = stations.find(({ id }) => id === stationId);
        return foundStation?.city ?? 'Unknown';
      });
    }
  }

  private updateCarriageNames(carriages: TCarriage[]) {
    if (this.ridesState?.route) {
      const uniqueCarriages = new Set(this.ridesState.route.carriages);
      this.carriages = [...uniqueCarriages].map((carriageCode) => {
        const foundCarriage = carriages.find(
          ({ code }) => code === carriageCode,
        );
        return foundCarriage?.name ?? 'Unknown';
      });
    }
  }

  get title() {
    return this.ridesState?.route?.id.toString() ?? 'Unknown';
  }

  get route() {
    return this.ridesState?.route;
  }

  get storeStatus() {
    return this.ridesState?.status ?? 'loading';
  }

  get errorMessage() {
    return this.ridesState?.error?.message;
  }

  public rideCreateEvent({ segments }: Omit<TRouteRide, 'rideId'>) {
    if (this.routeId) {
      this.ridesFacade.create(this.routeId, { segments });
    }
  }

  public rideChangeEvent({ rideId, segments }: TRouteRide) {
    if (this.routeId) {
      const dates: Date[] = [];
      segments.forEach(({ time }) => {
        dates.push(new Date(time[0]));
        dates.push(new Date(time[1]));
      });
      if (!datesAreSequential(dates)) {
        this.notificationService.messageError('Dates are not sequential');
        return;
      }
      this.ridesFacade.update(this.routeId, { id: rideId, segments });
    }
  }

  public rideDeleteEvent(rideId: number) {
    if (this.routeId) {
      this.ridesFacade
        .delete(this.routeId, rideId)
        .subscribe(({ status, error }) => {
          if (status === 'success') {
            this.notificationService.messageConfirm('Ride deleted');
          } else {
            this.notificationService.messageError(error?.message);
          }
        });
    }
  }

  public closeFormEvent() {
    this.formToggle = false;
  }

  public createClick() {
    this.formToggle = true;
  }

  public backClick() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }
}
