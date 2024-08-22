import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { StationsService } from '@/features/stations-management/services/stations.service';
import {
  createStation,
  createStationError,
  createStationSuccess,
  deleteStation,
  deleteStationError,
  deleteStationSuccess,
  loadStations,
  loadStationsError,
  loadStationsSuccess,
} from '../actions/stations.actions';

@Injectable()
export class StationsEffects {
  constructor(
    private actions$: Actions,
    private stationsService: StationsService,
  ) {}

  loadStations$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadStations),
      switchMap(() =>
        this.stationsService.getStations().pipe(
          map((stations) => loadStationsSuccess({ stations })),
          catchError((error) => of(loadStationsError({ error }))),
        ),
      ),
    );
  });

  createStation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createStation),
      switchMap(({ station }) =>
        this.stationsService.createStation(station).pipe(
          switchMap(() =>
            this.stationsService.getStations().pipe(
              map((stations) => createStationSuccess({ stations })),
              catchError((error) => of(createStationError({ error }))),
            ),
          ),
          catchError((error) => of(createStationError({ error }))),
        ),
      ),
    );
  });

  deleteStation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteStation),
      switchMap(({ id }) =>
        this.stationsService.deleteStation(id).pipe(
          map(() => deleteStationSuccess({ id })),
          catchError((error) => of(deleteStationError({ error }))),
        ),
      ),
    );
  });
}
