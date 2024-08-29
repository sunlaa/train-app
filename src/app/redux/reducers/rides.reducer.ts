import { createFeature, createReducer, on } from '@ngrx/store';
import { ApiError } from '@/core/models/api.model';
import { TRouteRide, TRouteRides } from '@/core/models/rides.model';
import { ridesActions } from '../actions';

export type RidesState = {
  route: TRouteRides | undefined;
  error: ApiError | null;
  status: 'loading' | 'error' | 'success';
};

const initialState: RidesState = {
  route: undefined,
  error: null,
  status: 'loading',
};

const ridesReducer = createReducer(
  initialState,
  // Load rides
  on(
    ridesActions.load,
    (state): RidesState => ({ ...state, status: 'loading' }),
  ),
  on(
    ridesActions.loadSuccess,
    (state, { route }): RidesState => ({
      route,
      error: null,
      status: 'success',
    }),
  ),
  on(
    ridesActions.loadError,
    (state, { error }): RidesState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
  // Create ride
  on(
    ridesActions.create,
    (state): RidesState => ({ ...state, status: 'loading' }),
  ),
  on(ridesActions.createSuccess, (state, { ride }): RidesState => {
    const routeRide: TRouteRide = { rideId: ride.id, segments: ride.segments };
    const newState: RidesState = {
      route: state.route,
      error: null,
      status: 'success',
    };
    if (newState.route) {
      const newRoute = { ...newState.route };
      newRoute.schedule = [...newState.route.schedule, routeRide];
      newState.route = newRoute;
    }
    return newState;
  }),
  on(
    ridesActions.createError,
    (state, { error }): RidesState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
  // Update ride
  on(
    ridesActions.update,
    (state): RidesState => ({ ...state, status: 'loading' }),
  ),
  on(ridesActions.updateSuccess, (state, { ride }): RidesState => {
    const routeRide: TRouteRide = { rideId: ride.id, segments: ride.segments };
    const newState: RidesState = {
      route: state.route,
      error: null,
      status: 'success',
    };
    if (newState.route) {
      const newRoute = { ...newState.route };
      newRoute.schedule = newState.route.schedule.map((rd) =>
        rd.rideId === routeRide.rideId ? routeRide : rd,
      );
      newState.route = newRoute;
    }
    return newState;
  }),
  on(
    ridesActions.updateError,
    (state, { error }): RidesState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
  // Delete ride
  on(
    ridesActions.delete,
    (state): RidesState => ({ ...state, status: 'loading' }),
  ),
  on(ridesActions.deleteSuccess, (state, { rideId }): RidesState => {
    const { route } = state;
    if (route) {
      return {
        route: {
          ...route,
          schedule: route.schedule.filter(({ rideId: id }) => id !== rideId),
        },
        error: null,
        status: 'success',
      };
    }
    return state;
  }),
  on(
    ridesActions.deleteError,
    (state, { error }): RidesState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
);

export const ridesFeature = createFeature({
  name: 'rides',
  reducer: ridesReducer,
});
