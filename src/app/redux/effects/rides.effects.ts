import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { RidesService } from '@/features/rides-management/services/rides.service';
import { ridesActions } from '../actions';

@Injectable()
export class RidesEffects {
  constructor(
    private actions$: Actions,
    private ridesService: RidesService,
  ) {}

  loadRouteRides$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ridesActions.load),
      switchMap(({ routeId }) =>
        this.ridesService.getRouteRides(routeId).pipe(
          map((route) => ridesActions.loadSuccess({ route })),
          catchError((error) => of(ridesActions.loadError({ error }))),
        ),
      ),
    );
  });

  createRide$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ridesActions.create),
      switchMap(({ routeId, ride }) =>
        this.ridesService.createRide(routeId, ride).pipe(
          map(({ id }) =>
            ridesActions.createSuccess({ ride: { ...ride, id } }),
          ),
          catchError((error) => of(ridesActions.createError({ error }))),
        ),
      ),
    );
  });

  updateRide$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ridesActions.update),
      switchMap(({ routeId, ride }) =>
        this.ridesService.updateRide(routeId, ride).pipe(
          map(() => ridesActions.updateSuccess({ ride })),
          catchError((error) => of(ridesActions.updateError({ error }))),
        ),
      ),
    );
  });
}
