import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { StationsService } from '@/features/stations-management/services/stations.service';
import { stationsActions } from '../actions';

@Injectable()
export class StationsEffects {
  constructor(
    private actions$: Actions,
    private stationsService: StationsService,
  ) {}

  loadStations$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(stationsActions.loadStations),
      switchMap(() =>
        this.stationsService.getStations().pipe(
          map((stations) => stationsActions.loadStationsSuccess({ stations })),
          catchError((error) =>
            of(stationsActions.loadStationsError({ error })),
          ),
        ),
      ),
    );
  });

  createStation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(stationsActions.createStation),
      switchMap(({ station }) =>
        this.stationsService.createStation(station).pipe(
          switchMap(() =>
            this.stationsService.getStations().pipe(
              map((stations) =>
                stationsActions.createStationSuccess({ stations }),
              ),
              catchError((error) =>
                of(stationsActions.createStationError({ error })),
              ),
            ),
          ),
          catchError((error) =>
            of(stationsActions.createStationError({ error })),
          ),
        ),
      ),
    );
  });

  deleteStation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(stationsActions.deleteStation),
      switchMap(({ id }) =>
        this.stationsService.deleteStation(id).pipe(
          map(() => stationsActions.deleteStationSuccess({ id })),
          catchError((error) =>
            of(stationsActions.deleteStationError({ error })),
          ),
        ),
      ),
    );
  });
}
