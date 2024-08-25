import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RoutesService } from '@/features/routes-management/services/routes.service';
import { catchError, map, of, switchMap } from 'rxjs';
import { routesActions } from '../actions';

@Injectable()
export class RoutesEffects {
  constructor(
    private actions$: Actions,
    private routeService: RoutesService,
  ) {}

  loadRoutes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routesActions.load),
      switchMap(() =>
        this.routeService.getRoutes().pipe(
          map((routes) => routesActions.loadSuccess({ routes })),
          catchError((error) => of(routesActions.loadError({ error }))),
        ),
      ),
    );
  });

  createRoute$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routesActions.create),
      switchMap(({ route }) =>
        this.routeService.createRoute(route).pipe(
          map((routeId) =>
            routesActions.createSuccess({
              route: { ...route, ...routeId },
            }),
          ),
          catchError((error) => of(routesActions.createError({ error }))),
        ),
      ),
    );
  });

  updateRoute$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routesActions.update),
      switchMap(({ route }) =>
        this.routeService.updateRoute(route).pipe(
          map((routeId) =>
            routesActions.updateSuccess({
              route: { ...route, ...routeId },
            }),
          ),
          catchError((error) => of(routesActions.updateError({ error }))),
        ),
      ),
    );
  });

  deleteRoute$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routesActions.delete),
      switchMap(({ id }) =>
        this.routeService.deleteRoute(id).pipe(
          map(() => routesActions.deleteSuccess({ id })),
          catchError((error) => of(routesActions.deleteError({ error }))),
        ),
      ),
    );
  });
}
