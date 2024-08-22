import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { StationsState } from '../reducers/stations.reducer';

export const selectStations = (state: AppState) => {
  return state.stations;
};
export const selectStationsState = createSelector(
  selectStations,
  (state: StationsState) => state,
);
