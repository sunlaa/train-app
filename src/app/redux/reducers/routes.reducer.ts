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
    routesActions.load,
    (state): RoutesState => ({ ...state, status: 'loading' }),
  ),
  on(
    routesActions.loadSuccess,
    (state, { routes }): RoutesState => ({
      routes,
      error: null,
      status: 'success',
    }),
  ),
  on(
    routesActions.loadError,
    (state, { error }): RoutesState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
  // Create route
  on(
    routesActions.create,
    (state): RoutesState => ({ ...state, status: 'loading' }),
  ),
  on(
    routesActions.createSuccess,
    (state, { route }): RoutesState => ({
      routes: [...state.routes, route],
      error: null,
      status: 'success',
    }),
  ),
  on(
    routesActions.createError,
    (state, { error }): RoutesState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
  // Update route
  on(
    routesActions.update,
    (state): RoutesState => ({ ...state, status: 'loading' }),
  ),
  on(
    routesActions.updateSuccess,
    (state, { route }): RoutesState => ({
      routes: state.routes.map((storeRoute) =>
        storeRoute.id === route.id ? route : storeRoute,
      ),
      error: null,
      status: 'success',
    }),
  ),
  on(
    routesActions.updateError,
    (state, { error }): RoutesState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
  // Delete route
  on(
    routesActions.delete,
    (state): RoutesState => ({ ...state, status: 'loading' }),
  ),
  on(
    routesActions.deleteSuccess,
    (state, { id }): RoutesState => ({
      routes: state.routes.filter((route) => route.id !== id),
      error: null,
      status: 'success',
    }),
  ),
  on(
    routesActions.deleteError,
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
