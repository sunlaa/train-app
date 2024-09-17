import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '@/core/models/api.model';
import { MockRoutesData } from '@/testing/mocks';
import { TRoute } from '@/core/models/routes.model';
import { routesActions } from '../actions';
import { RoutesState, routesFeature } from './routes.reducer';

describe('RoutesReducer', () => {
  let initialState: RoutesState;
  const genericApiError: ApiError = {
    message: 'Error with routes',
    reason: 'routesError',
  };

  beforeEach(() => {
    initialState = {
      routes: [],
      error: null,
      status: 'loading',
    };
  });

  // Load actions

  it('should set loading status when load action is dispatched', () => {
    const action = routesActions.load();
    const newState = routesFeature.reducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      status: 'loading',
    });
  });

  it('should update routes and set success status when loadSuccess action is dispatched', () => {
    const { routes } = MockRoutesData;

    const state = routesFeature.reducer(
      initialState,
      routesActions.loadSuccess({ routes }),
    );

    expect(state).toEqual({
      routes,
      error: null,
      status: 'success',
    });
  });

  it('should set error and status when loadError action is dispatched', () => {
    const error = new HttpErrorResponse({ error: genericApiError });

    const state = routesFeature.reducer(
      initialState,
      routesActions.loadError({ error }),
    );

    expect(state).toEqual({
      ...initialState,
      error: genericApiError,
      status: 'error',
    });
  });

  // Create actions

  it('should set loading status when create action is dispatched', () => {
    const route = MockRoutesData.routes[0];

    const state = routesFeature.reducer(
      initialState,
      routesActions.create({
        route,
      }),
    );

    expect(state).toEqual({
      ...initialState,
      status: 'loading',
    });
  });

  it('should add a route and set success status when createSuccess action is dispatched', () => {
    const route = MockRoutesData.routes[0];

    const state = routesFeature.reducer(
      initialState,
      routesActions.createSuccess({ route }),
    );

    expect(state).toEqual({
      routes: [route],
      error: null,
      status: 'success',
    });
  });

  it('should set error and status when createError action is dispatched', () => {
    const error = new HttpErrorResponse({ error: genericApiError });

    const state = routesFeature.reducer(
      initialState,
      routesActions.createError({ error }),
    );

    expect(state).toEqual({
      ...initialState,
      error: genericApiError,
      status: 'error',
    });
  });

  // Update actions

  it('should set loading status when update action is dispatched', () => {
    const route = MockRoutesData.routes[0];

    const state = routesFeature.reducer(
      initialState,
      routesActions.update({
        route,
      }),
    );

    expect(state).toEqual({
      ...initialState,
      status: 'loading',
    });
  });

  it('should update a route when updateSuccess action is dispatched', () => {
    const routes = MockRoutesData.routes.slice(0, 2);
    const previousState: RoutesState = {
      ...initialState,
      routes,
    };

    const updatedRoute: TRoute = {
      ...routes[0],
      carriages: ['A1', 'B2', 'C3', 'D4'],
    };

    const state = routesFeature.reducer(
      previousState,
      routesActions.updateSuccess({ route: updatedRoute }),
    );

    expect(state).toEqual({
      ...previousState,
      routes: [updatedRoute, routes[1]],
      error: null,
      status: 'success',
    });
  });

  it('should set error and status when updateError action is dispatched', () => {
    const error = new HttpErrorResponse({ error: genericApiError });

    const state = routesFeature.reducer(
      initialState,
      routesActions.updateError({ error }),
    );

    expect(state).toEqual({
      ...initialState,
      error: genericApiError,
      status: 'error',
    });
  });

  // Delete actions

  it('should set loading status when delete action is dispatched', () => {
    const { id } = MockRoutesData.routes[0];

    const state = routesFeature.reducer(
      initialState,
      routesActions.delete({
        id,
      }),
    );

    expect(state).toEqual({
      ...initialState,
      status: 'loading',
    });
  });

  it('should remove a route when deleteSuccess action is dispatched', () => {
    const { id } = MockRoutesData.routes[0];
    const routes = MockRoutesData.routes.slice(0, 2);
    const previousState: RoutesState = {
      ...initialState,
      routes,
    };

    const state = routesFeature.reducer(
      previousState,
      routesActions.deleteSuccess({ id }),
    );

    expect(state).toEqual({
      ...previousState,
      routes: [routes[1]],
      error: null,
      status: 'success',
    });
  });

  it('should set error and status when deleteError action is dispatched', () => {
    const error = new HttpErrorResponse({ error: genericApiError });

    const state = routesFeature.reducer(
      initialState,
      routesActions.deleteError({ error }),
    );

    expect(state).toEqual({
      ...initialState,
      error: genericApiError,
      status: 'error',
    });
  });
});
