import { RideHeader } from '@/core/models/trip.model';
import { Segment } from '@/core/models/search.model';
import { StationMap } from '@/core/models/stations.model';
import getRideDates from './rideDates';
import getRouteDetails from './routeDetails';

export default function getRideHeaderData(
  routeId: number,
  rideId: number,
  ridePath: Segment[],
  ridePathIds: number[],
  stationMap: StationMap,
): RideHeader {
  const { departureDate, arrivalDate } = getRideDates(ridePath);

  const stopInfo = getRouteDetails(ridePath, ridePathIds, stationMap);

  return { routeId, rideId, departureDate, arrivalDate, stopInfo };
}
