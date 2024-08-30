import { DestroyService } from '@/core/services/destroy/destroy.service';
import { RidePageData } from '@/core/models/trip.model';
import { CarriagesFacadeService } from '@/features/carriages-management/services/carriages-facade.service';
import { StationsFacadeService } from '@/features/stations-management/services/stations-facade.service';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CarriageComponent } from '@/shared/components/carriage/carriage.component';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { CardModule } from 'primeng/card';
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
import { TripDetailsService } from '../../services/trip-details/trip.service';

@Component({
  selector: 'app-trip-details',
  standalone: true,
  imports: [
    ButtonModule,
    SkeletonModule,
    TabViewModule,
    CardModule,
    ChipModule,
    DatePipe,
    CarriageComponent,
    CurrencyPipe,
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

  private rideId: string | null = null;

  private fromId: number | null = null;

  private toId: number | null = null;

  public fromCity: string = '';

  public toCity: string = '';

  public pageData: RidePageData | null = null;

  ngOnInit() {
    combineLatest([this.route.paramMap, this.route.queryParamMap])
      .pipe(
        takeUntil(this.destroy$),
        tap(([params, query]) => {
          this.extractParams(params, query);
        }),
        switchMap(() => this.waitForLoading()),
        switchMap(() => this.loadRideDetails()),
        takeUntil(this.destroy$),
      )
      .subscribe((data) => {
        this.pageData = data;
      });
  }

  private extractParams(params: ParamMap, query: ParamMap) {
    this.rideId = params.get('rideId');
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
}
