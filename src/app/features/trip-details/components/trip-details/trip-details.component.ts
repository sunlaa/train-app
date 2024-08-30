import { DestroyService } from '@/core/services/destroy/destroy.service';
import { RideCarriageData } from '@/core/models/trip.model';
import { CarriagesFacadeService } from '@/features/carriages-management/services/carriages-facade.service';
import { StationsFacadeService } from '@/features/stations-management/services/stations-facade.service';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, filter, take, takeUntil, tap } from 'rxjs';
import { TripDetailsService } from '../../services/trip-details/trip.service';

@Component({
  selector: 'app-trip-details',
  standalone: true,
  imports: [],
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

  private rideId: string | null = null;

  private fromId: number | null = null;

  private toId: number | null = null;

  public fromCity: string = '';

  public toCity: string = '';

  public rideCarriagesData: RideCarriageData[] = [];

  ngOnInit() {
    combineLatest([this.route.paramMap, this.route.queryParamMap])
      .pipe(
        takeUntil(this.destroy$),
        tap(([params, query]) => {
          this.rideId = params.get('rideId');
          this.fromId = +query.get('from')!;
          this.toId = +query.get('to')!;
        }),
      )
      .subscribe(() => {
        combineLatest([this.stationsFacade.state$, this.carriagesFacade.state$])
          .pipe(
            filter(
              ([stationState, carriageState]) =>
                stationState.status !== 'loading' &&
                carriageState.status !== 'loading',
            ),
            take(1),
          )
          .subscribe(() => {
            const stationMap = this.stationsFacade.stationMap();
            if (!stationMap) throw Error('No station map in store.');

            const carriageMap = this.carriagesFacade.carriageMap();
            if (!carriageMap) throw Error('No carriage map in store.');

            if (!this.rideId || !this.fromId || !this.toId) {
              throw Error(
                'One of the following data was not received: rideId, fromId, toId.',
              );
            }

            this.fromCity = stationMap[this.fromId].city;
            this.toCity = stationMap[this.toId].city;

            this.tripService
              .getRideDetails(this.rideId, this.fromId, this.toId, carriageMap)
              .pipe(takeUntil(this.destroy$))
              .subscribe((data) => {
                this.rideCarriagesData = data;
              });
          });
      });
  }
}
