import { TRoute } from '@/core/models/routes.model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { ApiError } from '@/core/models/api.model';
import { routesActions } from '../actions';

export type RoutesState = {
  routes: TRoute[];
  error: ApiError | null;
  status: 'loading' | 'error' | 'success';
};

const initialState: RoutesState = {
  routes: [],
  error: null,
  status: 'loading',
};

const routesReducer = createReducer(
  initialState,
  // Load routes
  on(
    routesActions.loadRoutes,
    (state): RoutesState => ({ ...state, status: 'loading' }),
  ),
  on(
    routesActions.loadRoutesSuccess,
    (state, { routes }): RoutesState => ({
      routes,
      error: null,
      status: 'success',
    }),
  ),
  on(
    routesActions.loadRoutesError,
    (state, { error }): RoutesState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
  // Create route
  on(
    routesActions.createRoute,
    (state): RoutesState => ({ ...state, status: 'loading' }),
  ),
  on(
    routesActions.createRouteSuccess,
    (state, { route }): RoutesState => ({
      routes: [...state.routes, route],
      error: null,
      status: 'success',
    }),
  ),
  on(
    routesActions.createRouteError,
    (state, { error }): RoutesState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
  // Update route
  on(
    routesActions.updateRoute,
    (state): RoutesState => ({ ...state, status: 'loading' }),
  ),
  on(
    routesActions.updateRouteSuccess,
    (state, { route }): RoutesState => ({
      routes: state.routes.map((storeRoute) =>
        storeRoute.id === route.id ? route : storeRoute,
      ),
      error: null,
      status: 'success',
    }),
  ),
  on(
    routesActions.updateRouteError,
    (state, { error }): RoutesState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
  // Delete route
  on(
    routesActions.deleteRoute,
    (state): RoutesState => ({ ...state, status: 'loading' }),
  ),
  on(
    routesActions.deleteRouteSuccess,
    (state, { id }): RoutesState => ({
      routes: state.routes.filter((route) => route.id !== id),
      error: null,
      status: 'success',
    }),
  ),
  on(
    routesActions.deleteRouteError,
    (state, { error }): RoutesState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
);

export const routesFeature = createFeature({
  name: 'routes',
  reducer: routesReducer,
});
