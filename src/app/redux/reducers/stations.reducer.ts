import { createFeature, createReducer, on } from '@ngrx/store';
import { ApiError } from '@/core/models/api.model';
import { TStationListed } from '@/core/models/stations.model';
import { stationsActions } from '../actions';

export type StationsState = {
  stations: TStationListed[];
  error: ApiError | null;
  status: 'loading' | 'error' | 'success';
};

const initialState: StationsState = {
  stations: [],
  error: null,
  status: 'loading',
};

const stationsReducer = createReducer(
  initialState,
  // Load stations
  on(
    stationsActions.loadStations,
    (state): StationsState => ({ ...state, status: 'loading' }),
  ),
  on(
    stationsActions.loadStationsSuccess,
    (state, { stations }): StationsState => ({
      stations,
      error: null,
      status: 'success',
    }),
  ),
  on(
    stationsActions.loadStationsError,
    (state, { error }): StationsState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
  // Create station
  on(
    stationsActions.createStation,
    (state): StationsState => ({ ...state, status: 'loading' }),
  ),
  on(
    stationsActions.createStationSuccess,
    (state, { stations }): StationsState => ({
      stations,
      error: null,
      status: 'success',
    }),
  ),
  on(
    stationsActions.createStationError,
    (state, { error }): StationsState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
  // Delete station
  on(
    stationsActions.deleteStation,
    (state): StationsState => ({ ...state, status: 'loading' }),
  ),
  on(
    stationsActions.deleteStationSuccess,
    (state, { id }): StationsState => ({
      stations: state.stations.filter((station) => station.id !== id),
      error: null,
      status: 'success',
    }),
  ),
  on(
    stationsActions.deleteStationError,
    (state, { error }): StationsState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
);

export const stationsFeature = createFeature({
  name: 'stations',
  reducer: stationsReducer,
});
