import { createSelector } from '@ngrx/store';
import { StationsMap } from '@/core/models/stations.model';
import { stationsFeature } from '../reducers';

export const selectStationsMap = createSelector(
  stationsFeature.selectStations,
  (stations) => {
    return stations.reduce<StationsMap>((acc, station) => {
      const map = acc;
      map[station.id] = station;
      return map;
    }, {});
  },
);
