import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { ApiError } from '@/core/models/api.model';
import { StationMap, TStationListed } from '@/core/models/stations.model';
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
    stationsActions.load,
    (state): StationsState => ({ ...state, status: 'loading' }),
  ),
  on(
    stationsActions.loadSuccess,
    (state, { stations }): StationsState => ({
      stations,
      error: null,
      status: 'success',
    }),
  ),
  on(
    stationsActions.loadError,
    (state, { error }): StationsState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
  // Create station
  on(
    stationsActions.create,
    (state): StationsState => ({ ...state, status: 'loading' }),
  ),
  on(
    stationsActions.createSuccess,
    (state, { stations }): StationsState => ({
      stations,
      error: null,
      status: 'success',
    }),
  ),
  on(
    stationsActions.createError,
    (state, { error }): StationsState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
  // Delete station
  on(
    stationsActions.delete,
    (state): StationsState => ({ ...state, status: 'loading' }),
  ),
  on(
    stationsActions.deleteSuccess,
    (state, { id }): StationsState => ({
      stations: state.stations.filter((station) => station.id !== id),
      error: null,
      status: 'success',
    }),
  ),
  on(
    stationsActions.deleteError,
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
  extraSelectors: ({ selectStations }) => ({
    selectStationMap: createSelector(selectStations, (stations) => {
      return stations.reduce<StationMap>((acc, station) => {
        const map = acc;
        map[station.id] = station;
        return map;
      }, {});
    }),
  }),
});
