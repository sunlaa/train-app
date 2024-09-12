import { TCarriage } from '@/core/models/carriages.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '@/core/models/api.model';
import { MockCarriagesData } from '@/testing/mocks';
import { carriagesActions } from '../actions';
import { CarriagesState, carriagesFeature } from './carriages.reducer';

describe('CarriagesReducer', () => {
  let initialState: CarriagesState;
  const genericApiError: ApiError = {
    message: 'Error with carriages',
    reason: 'carriagesError',
  };

  beforeEach(() => {
    initialState = {
      carriages: [],
      error: null,
      status: 'loading',
    };
  });

  // Load actions

  it('should set loading status when load action is dispatched', () => {
    const action = carriagesActions.load();
    const newState = carriagesFeature.reducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      status: 'loading',
    });
  });

  it('should update carriages and set success status when loadSuccess action is dispatched', () => {
    const { carriages } = MockCarriagesData;

    const state = carriagesFeature.reducer(
      initialState,
      carriagesActions.loadSuccess({ carriages }),
    );

    expect(state).toEqual({
      carriages,
      error: null,
      status: 'success',
    });
  });

  it('should set error and status when loadError action is dispatched', () => {
    const error = new HttpErrorResponse({ error: genericApiError });

    const state = carriagesFeature.reducer(
      initialState,
      carriagesActions.loadError({ error }),
    );

    expect(state).toEqual({
      ...initialState,
      error: genericApiError,
      status: 'error',
    });
  });

  // Create actions

  it('should set loading status when create action is dispatched', () => {
    const carriage = MockCarriagesData.carriages[0];

    const state = carriagesFeature.reducer(
      initialState,
      carriagesActions.create({
        carriage,
      }),
    );

    expect(state).toEqual({
      ...initialState,
      status: 'loading',
    });
  });

  it('should add a carriage and set success status when createSuccess action is dispatched', () => {
    const carriage = MockCarriagesData.carriages[0];

    const state = carriagesFeature.reducer(
      initialState,
      carriagesActions.createSuccess({ carriage }),
    );

    expect(state).toEqual({
      carriages: [carriage],
      error: null,
      status: 'success',
    });
  });

  it('should set error and status when createError action is dispatched', () => {
    const error = new HttpErrorResponse({ error: genericApiError });

    const state = carriagesFeature.reducer(
      initialState,
      carriagesActions.createError({ error }),
    );

    expect(state).toEqual({
      ...initialState,
      error: genericApiError,
      status: 'error',
    });
  });

  // Update actions

  it('should set loading status when update action is dispatched', () => {
    const carriage = MockCarriagesData.carriages[0];

    const state = carriagesFeature.reducer(
      initialState,
      carriagesActions.update({
        carriage,
      }),
    );

    expect(state).toEqual({
      ...initialState,
      status: 'loading',
    });
  });

  it('should update a carriage when updateSuccess action is dispatched', () => {
    const carriages = MockCarriagesData.carriages.slice(0, 2);
    const previousState: CarriagesState = {
      ...initialState,
      carriages,
    };

    const updatedCarriage: TCarriage = {
      ...carriages[0],
      name: 'First Class Updated',
    };

    const state = carriagesFeature.reducer(
      previousState,
      carriagesActions.updateSuccess({ carriage: updatedCarriage }),
    );

    expect(state).toEqual({
      carriages: [updatedCarriage, carriages[1]],
      error: null,
      status: 'success',
    });
  });

  it('should set error and status when updateError action is dispatched', () => {
    const error = new HttpErrorResponse({ error: genericApiError });

    const state = carriagesFeature.reducer(
      initialState,
      carriagesActions.updateError({ error }),
    );

    expect(state).toEqual({
      ...initialState,
      error: genericApiError,
      status: 'error',
    });
  });

  // Delete actions

  it('should set loading status when delete action is dispatched', () => {
    const { code } = MockCarriagesData.carriages[0];

    const state = carriagesFeature.reducer(
      initialState,
      carriagesActions.delete({
        code,
      }),
    );

    expect(state).toEqual({
      ...initialState,
      status: 'loading',
    });
  });

  it('should remove a carriage when deleteSuccess action is dispatched', () => {
    const { code } = MockCarriagesData.carriages[0];
    const carriages = MockCarriagesData.carriages.slice(0, 2);
    const previousState: CarriagesState = {
      ...initialState,
      carriages,
    };

    const state = carriagesFeature.reducer(
      previousState,
      carriagesActions.deleteSuccess({ code }),
    );

    expect(state).toEqual({
      carriages: [carriages[1]],
      error: null,
      status: 'success',
    });
  });

  it('should set error and status when deleteError action is dispatched', () => {
    const error = new HttpErrorResponse({ error: genericApiError });

    const state = carriagesFeature.reducer(
      initialState,
      carriagesActions.deleteError({ error }),
    );

    expect(state).toEqual({
      ...initialState,
      error: genericApiError,
      status: 'error',
    });
  });
});
