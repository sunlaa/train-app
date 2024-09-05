import { CarriageMap } from '@/core/models/carriages.model';
import { StationMap } from '@/core/models/stations.model';

export default class MockTripDetails {
  getRideDetails(
    id: number,
    fromId: number,
    toId: number,
    carriageMap: CarriageMap,
    stationMap: StationMap,
  ) {
    return { id, fromId, toId, carriageMap, stationMap };
  }
}
