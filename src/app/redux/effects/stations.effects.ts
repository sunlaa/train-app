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
      ofType(stationsActions.load),
      switchMap(() =>
        this.stationsService.getStations().pipe(
          map((stations) => stationsActions.loadSuccess({ stations })),
          catchError((error) => of(stationsActions.loadError({ error }))),
        ),
      ),
    );
  });

  createStation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(stationsActions.create),
      switchMap(({ station }) =>
        this.stationsService.createStation(station).pipe(
          switchMap(() =>
            this.stationsService.getStations().pipe(
              map((stations) => stationsActions.createSuccess({ stations })),
              catchError((error) => of(stationsActions.createError({ error }))),
            ),
          ),
          catchError((error) => of(stationsActions.createError({ error }))),
        ),
      ),
    );
  });

  deleteStation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(stationsActions.delete),
      switchMap(({ id }) =>
        this.stationsService.deleteStation(id).pipe(
          map(() => stationsActions.deleteSuccess({ id })),
          catchError((error) => of(stationsActions.deleteError({ error }))),
        ),
      ),
    );
  });
}
