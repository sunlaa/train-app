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
      ofType(routesActions.loadRoutes),
      switchMap(() =>
        this.routeService.getRoutes().pipe(
          map((routes) => routesActions.loadRoutesSuccess({ routes })),
          catchError((error) => of(routesActions.loadRoutesError({ error }))),
        ),
      ),
    );
  });

  createRoute$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routesActions.createRoute),
      switchMap(({ route }) =>
        this.routeService.createRoute(route).pipe(
          map((routeId) =>
            routesActions.createRouteSuccess({
              route: { ...route, ...routeId },
            }),
          ),
          catchError((error) => of(routesActions.createRouteError({ error }))),
        ),
      ),
    );
  });

  updateRoute$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routesActions.updateRoute),
      switchMap(({ route }) =>
        this.routeService.updateRoute(route).pipe(
          map((routeId) =>
            routesActions.updateRouteSuccess({
              route: { ...route, ...routeId },
            }),
          ),
          catchError((error) => of(routesActions.updateRouteError({ error }))),
        ),
      ),
    );
  });

  deleteRoute$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routesActions.deleteRoute),
      switchMap(({ id }) =>
        this.routeService.deleteRoute(id).pipe(
          map(() => routesActions.deleteRouteSuccess({ id })),
          catchError((error) => of(routesActions.deleteRouteError({ error }))),
        ),
      ),
    );
  });
}
