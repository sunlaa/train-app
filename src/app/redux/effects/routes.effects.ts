import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RoutesService } from '@/features/routes-management/services/routes.service';
import { catchError, map, of, switchMap } from 'rxjs';
import {
  createRoute,
  createRouteError,
  createRouteSuccess,
  deleteRoute,
  deleteRouteError,
  deleteRouteSuccess,
  loadRoutes,
  loadRoutesError,
  loadRoutesSuccess,
  updateRoute,
  updateRouteError,
  updateRouteSuccess,
} from '../actions/routes.actions';

@Injectable()
export class RoutesEffects {
  constructor(
    private actions$: Actions,
    private routeService: RoutesService,
  ) {}

  loadRoutes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadRoutes),
      switchMap(() =>
        this.routeService.getRoutes().pipe(
          map((routes) => loadRoutesSuccess({ routes })),
          catchError((error) => of(loadRoutesError({ error }))),
        ),
      ),
    );
  });

  createRoute$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createRoute),
      switchMap(({ route }) =>
        this.routeService.createRoute(route).pipe(
          map((routeId) =>
            createRouteSuccess({ route: { ...route, ...routeId } }),
          ),
          catchError((error) => of(createRouteError({ error }))),
        ),
      ),
    );
  });

  updateRoute$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateRoute),
      switchMap(({ route }) =>
        this.routeService.updateRoute(route).pipe(
          map((routeId) =>
            updateRouteSuccess({ route: { ...route, ...routeId } }),
          ),
          catchError((error) => of(updateRouteError({ error }))),
        ),
      ),
    );
  });

  deleteRoute$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteRoute),
      switchMap(({ id }) =>
        this.routeService.deleteRoute(id).pipe(
          map(() => deleteRouteSuccess({ id })),
          catchError((error) => of(deleteRouteError({ error }))),
        ),
      ),
    );
  });
}
