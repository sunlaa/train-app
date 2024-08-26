import { createSelector } from '@ngrx/store';
import { StationMap } from '@/core/models/stations.model';
import { CarriageMap } from '@/core/models/carriages.model';
import { carriagesFeature, stationsFeature } from '../reducers';

export const selectStationMap = createSelector(
  stationsFeature.selectStations,
  (stations) => {
    return stations.reduce<StationMap>((acc, station) => {
      const map = acc;
      map[station.id] = station;
      return map;
    }, {});
  },
);

export const selectCarriageMap = createSelector(
  carriagesFeature.selectCarriages,
  (carriages) => {
    return carriages.reduce<CarriageMap>((acc, carriage) => {
      const { rightSeats, leftSeats, rows } = carriage;
      const map = acc;
      const seats = (rightSeats + leftSeats) * rows;
      map[carriage.code] = { ...carriage, seats };
      return map;
    }, {});
  },
);
