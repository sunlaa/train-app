import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '@/core/models/api.model';
import { MockRidesData } from '@/testing/mocks/rides';
import { TRide, TRouteRide } from '@/core/models/rides.model';
import { ridesActions } from '../actions';
import { RidesState, ridesFeature } from './rides.reducer';

describe('RidesReducer', () => {
  let initialState: RidesState;
  const genericApiError: ApiError = {
    message: 'Error with rides',
    reason: 'ridesError',
  };

  beforeEach(() => {
    initialState = {
      route: undefined,
      error: null,
      status: 'loading',
    };
  });

  // Load actions

  it('should set loading status when load action is dispatched', () => {
    const action = ridesActions.load({ routeId: 1 });
    const newState = ridesFeature.reducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      status: 'loading',
    });
  });

  it('should update route rides and set success status when loadSuccess action is dispatched', () => {
    const { routeRides } = MockRidesData;

    const state = ridesFeature.reducer(
      initialState,
      ridesActions.loadSuccess({ route: routeRides }),
    );

    expect(state).toEqual({
      route: routeRides,
      error: null,
      status: 'success',
    });
  });

  it('should set error and status when loadError action is dispatched', () => {
    const error = new HttpErrorResponse({ error: genericApiError });

    const state = ridesFeature.reducer(
      initialState,
      ridesActions.loadError({ error }),
    );

    expect(state).toEqual({
      ...initialState,
      error: genericApiError,
      status: 'error',
    });
  });

  // Create actions

  it('should set loading status when create action is dispatched', () => {
    const { routeRides } = MockRidesData;
    const newRide = MockRidesData.rides[0];

    const state = ridesFeature.reducer(
      initialState,
      ridesActions.create({
        routeId: routeRides.id,
        ride: newRide,
      }),
    );

    expect(state).toEqual({
      ...initialState,
      status: 'loading',
    });
  });

  it('should add a ride and set success status when createSuccess action is dispatched', () => {
    const newRide = MockRidesData.rides[0];
    const routeRides = {
      ...MockRidesData.routeRides,
      schedule: [],
    };

    const expectedRide = MockRidesData.routeRides.schedule[0];
    const newRouteRides = { ...routeRides, schedule: [expectedRide] };
    const previousState: RidesState = {
      ...initialState,
      route: routeRides,
    };

    const state = ridesFeature.reducer(
      previousState,
      ridesActions.createSuccess({ ride: newRide }),
    );

    expect(state).toEqual({
      route: newRouteRides,
      error: null,
      status: 'success',
    });
  });

  it('should set error and status when createError action is dispatched', () => {
    const error = new HttpErrorResponse({ error: genericApiError });

    const state = ridesFeature.reducer(
      initialState,
      ridesActions.createError({ error }),
    );

    expect(state).toEqual({
      ...initialState,
      error: genericApiError,
      status: 'error',
    });
  });

  // Update actions

  it('should set loading status when update action is dispatched', () => {
    const { routeRides } = MockRidesData;
    const mockSegments = MockRidesData.rideSegments;
    const editRide: TRide = {
      id: MockRidesData.rides[0].id,
      segments: mockSegments,
    };

    const state = ridesFeature.reducer(
      initialState,
      ridesActions.update({
        routeId: routeRides.id,
        ride: editRide,
      }),
    );

    expect(state).toEqual({
      ...initialState,
      status: 'loading',
    });
  });

  it('should update a ride when updateSuccess action is dispatched', () => {
    const routeRide = MockRidesData.routeRides.schedule[0];
    const routeRides = {
      ...MockRidesData.routeRides,
      schedule: [routeRide],
    };

    const mockSegments = MockRidesData.rideSegments;
    const editRide: TRide = {
      id: MockRidesData.rides[0].id,
      segments: mockSegments,
    };
    const expectedEditRide: TRouteRide = {
      rideId: MockRidesData.rides[0].id,
      segments: mockSegments,
    };
    const newRouteRides = { ...routeRides, schedule: [expectedEditRide] };

    const previousState: RidesState = {
      ...initialState,
      route: routeRides,
    };

    const state = ridesFeature.reducer(
      previousState,
      ridesActions.updateSuccess({ ride: editRide }),
    );

    expect(state).toEqual({
      route: newRouteRides,
      error: null,
      status: 'success',
    });
  });

  it('should set error and status when updateError action is dispatched', () => {
    const error = new HttpErrorResponse({ error: genericApiError });

    const state = ridesFeature.reducer(
      initialState,
      ridesActions.updateError({ error }),
    );

    expect(state).toEqual({
      ...initialState,
      error: genericApiError,
      status: 'error',
    });
  });

  // Delete actions

  it('should set loading status when delete action is dispatched', () => {
    const { id: routeId } = MockRidesData.routeRides;
    const { id: rideId } = MockRidesData.rides[0];

    const state = ridesFeature.reducer(
      initialState,
      ridesActions.delete({
        routeId,
        rideId,
      }),
    );

    expect(state).toEqual({
      ...initialState,
      status: 'loading',
    });
  });

  it('should remove a ride when deleteSuccess action is dispatched', () => {
    const routeRide = MockRidesData.routeRides.schedule[0];
    const routeRides = {
      ...MockRidesData.routeRides,
      schedule: [routeRide],
    };
    const newRouteRides = { ...routeRides, schedule: [] };
    const previousState: RidesState = {
      ...initialState,
      route: routeRides,
    };

    const state = ridesFeature.reducer(
      previousState,
      ridesActions.deleteSuccess({ rideId: routeRide.rideId }),
    );

    expect(state).toEqual({
      route: newRouteRides,
      error: null,
      status: 'success',
    });
  });

  it('should set error and status when deleteError action is dispatched', () => {
    const error = new HttpErrorResponse({ error: genericApiError });

    const state = ridesFeature.reducer(
      initialState,
      ridesActions.deleteError({ error }),
    );

    expect(state).toEqual({
      ...initialState,
      error: genericApiError,
      status: 'error',
    });
  });
});
