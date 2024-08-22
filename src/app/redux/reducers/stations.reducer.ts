import { createReducer, on } from '@ngrx/store';
import { ApiError } from '@/core/models/api.model';
import { TStationListed } from '@/core/models/stations.model';
import {
  createStation,
  createStationError,
  createStationSuccess,
  deleteStation,
  deleteStationError,
  deleteStationSuccess,
  loadStations,
  loadStationsError,
  loadStationsSuccess,
} from '../actions/stations.actions';

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

export const stationsReducer = createReducer(
  initialState,
  // Load stations
  on(loadStations, (state): StationsState => ({ ...state, status: 'loading' })),
  on(
    loadStationsSuccess,
    (state, { stations }): StationsState => ({
      stations,
      error: null,
      status: 'success',
    }),
  ),
  on(
    loadStationsError,
    (state, { error }): StationsState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
  // Create station
  on(
    createStation,
    (state): StationsState => ({ ...state, status: 'loading' }),
  ),
  on(
    createStationSuccess,
    (state, { stations }): StationsState => ({
      stations,
      error: null,
      status: 'success',
    }),
  ),
  on(
    createStationError,
    (state, { error }): StationsState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
  // Delete station
  on(
    deleteStation,
    (state): StationsState => ({ ...state, status: 'loading' }),
  ),
  on(
    deleteStationSuccess,
    (state, { id }): StationsState => ({
      stations: state.stations.filter((station) => station.id !== id),
      error: null,
      status: 'success',
    }),
  ),
  on(
    deleteStationError,
    (state, { error }): StationsState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
);
