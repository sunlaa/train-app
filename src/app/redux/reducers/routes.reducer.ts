import { TRoute } from '@/core/models/routes.model';
import { createReducer, on } from '@ngrx/store';
import { ApiError } from '@/core/models/api.model';
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

export const routesReducer = createReducer(
  initialState,
  // Load routes
  on(loadRoutes, (state): RoutesState => ({ ...state, status: 'loading' })),
  on(
    loadRoutesSuccess,
    (state, { routes }): RoutesState => ({
      routes,
      error: null,
      status: 'success',
    }),
  ),
  on(
    loadRoutesError,
    (state, { error }): RoutesState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
  // Create route
  on(createRoute, (state): RoutesState => ({ ...state, status: 'loading' })),
  on(
    createRouteSuccess,
    (state, { route }): RoutesState => ({
      routes: [...state.routes, route],
      error: null,
      status: 'success',
    }),
  ),
  on(
    createRouteError,
    (state, { error }): RoutesState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
  // Update route
  on(updateRoute, (state): RoutesState => ({ ...state, status: 'loading' })),
  on(
    updateRouteSuccess,
    (state, { route }): RoutesState => ({
      routes: state.routes.map((storeRoute) =>
        storeRoute.id === route.id ? route : storeRoute,
      ),
      error: null,
      status: 'success',
    }),
  ),
  on(
    updateRouteError,
    (state, { error }): RoutesState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
  // Delete route
  on(deleteRoute, (state): RoutesState => ({ ...state, status: 'loading' })),
  on(
    deleteRouteSuccess,
    (state, { id }): RoutesState => ({
      routes: state.routes.filter((route) => route.id !== id),
      error: null,
      status: 'success',
    }),
  ),
  on(
    deleteRouteError,
    (state, { error }): RoutesState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
);
