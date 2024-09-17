import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '@/core/models/api.model';
import { MockStationsData } from '@/testing/mocks';
import { stationsActions } from '../actions';
import { StationsState, stationsFeature } from './stations.reducer';

describe('StationsReducer', () => {
  let initialState: StationsState;
  const genericApiError: ApiError = {
    message: 'Error with stations',
    reason: 'stationsError',
  };

  beforeEach(() => {
    initialState = {
      stations: [],
      error: null,
      status: 'loading',
    };
  });

  // Load actions

  it('should set loading status when load action is dispatched', () => {
    const action = stationsActions.load();
    const newState = stationsFeature.reducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      status: 'loading',
    });
  });

  it('should update stations and set success status when loadSuccess action is dispatched', () => {
    const { listedStations: stations } = MockStationsData;

    const state = stationsFeature.reducer(
      initialState,
      stationsActions.loadSuccess({ stations }),
    );

    expect(state).toEqual({
      stations,
      error: null,
      status: 'success',
    });
  });

  it('should set error and status when loadError action is dispatched', () => {
    const error = new HttpErrorResponse({ error: genericApiError });

    const state = stationsFeature.reducer(
      initialState,
      stationsActions.loadError({ error }),
    );

    expect(state).toEqual({
      ...initialState,
      error: genericApiError,
      status: 'error',
    });
  });

  // Create actions

  it('should set loading status when create action is dispatched', () => {
    const station = MockStationsData.creationStations[0];

    const state = stationsFeature.reducer(
      initialState,
      stationsActions.create({
        station,
      }),
    );

    expect(state).toEqual({
      ...initialState,
      status: 'loading',
    });
  });

  it('should set a stations and set success status when createSuccess action is dispatched', () => {
    const stations = MockStationsData.listedStations;

    const state = stationsFeature.reducer(
      initialState,
      stationsActions.createSuccess({ stations }),
    );

    expect(state).toEqual({
      stations,
      error: null,
      status: 'success',
    });
  });

  it('should set error and status when createError action is dispatched', () => {
    const error = new HttpErrorResponse({ error: genericApiError });

    const state = stationsFeature.reducer(
      initialState,
      stationsActions.createError({ error }),
    );

    expect(state).toEqual({
      ...initialState,
      error: genericApiError,
      status: 'error',
    });
  });

  // Delete actions

  it('should set loading status when delete action is dispatched', () => {
    const { id } = MockStationsData.listedStations[0];

    const state = stationsFeature.reducer(
      initialState,
      stationsActions.delete({
        id,
      }),
    );

    expect(state).toEqual({
      ...initialState,
      status: 'loading',
    });
  });

  it('should remove a station when deleteSuccess action is dispatched', () => {
    const { id } = MockStationsData.listedStations[0];
    const stations = MockStationsData.listedStations.slice(0, 2);
    const previousState: StationsState = {
      ...initialState,
      stations,
    };

    const state = stationsFeature.reducer(
      previousState,
      stationsActions.deleteSuccess({ id }),
    );

    expect(state).toEqual({
      stations: [stations[1]],
      error: null,
      status: 'success',
    });
  });

  it('should set error and status when deleteError action is dispatched', () => {
    const error = new HttpErrorResponse({ error: genericApiError });

    const state = stationsFeature.reducer(
      initialState,
      stationsActions.deleteError({ error }),
    );

    expect(state).toEqual({
      ...initialState,
      error: genericApiError,
      status: 'error',
    });
  });
});
