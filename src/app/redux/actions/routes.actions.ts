import { TRoute } from '@/core/models/routes.model';
import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';

// Load routes

export const loadRoutes = createAction('[Routes Management] Load routes');

export const loadRoutesSuccess = createAction(
  '[Routes API] Load routes success',
  props<{ routes: TRoute[] }>(),
);

export const loadRoutesError = createAction(
  '[Routes API] Load routes error',
  props<{ error: HttpErrorResponse }>(),
);

// Create route

export const createRoute = createAction(
  '[Routes Management] Create route',
  props<{ route: Omit<TRoute, 'id'> }>(),
);

export const createRouteSuccess = createAction(
  '[Routes API] Create route success',
  props<{ route: TRoute }>(),
);

export const createRouteError = createAction(
  '[Routes API] Create route error',
  props<{ error: HttpErrorResponse }>(),
);

// Update route

export const updateRoute = createAction(
  '[Routes Management] Update route',
  props<{ route: TRoute }>(),
);

export const updateRouteSuccess = createAction(
  '[Routes API] Update route success',
  props<{ route: TRoute }>(),
);

export const updateRouteError = createAction(
  '[Routes API] Update route error',
  props<{ error: HttpErrorResponse }>(),
);

// Delete route

export const deleteRoute = createAction(
  '[Routes Management] Delete route',
  props<{ id: number }>(),
);

export const deleteRouteSuccess = createAction(
  '[Routes API] Delete route success',
  props<{ id: number }>(),
);

export const deleteRouteError = createAction(
  '[Routes API] Delete route error',
  props<{ error: HttpErrorResponse }>(),
);
