import { RideHeader } from '@/core/models/trip.model';
import { Segment } from '@/core/models/search.model';
import { StationMap } from '@/core/models/stations.model';
import getRideDates from './rideDates';
import getRouteDetails from './routeDetails';

export default function getRideHeaderData(
  rideId: number,
  ridePath: Segment[],
  ridePathIds: number[],
  stationMap: StationMap,
): RideHeader {
  const { departureDate, arrivalDate } = getRideDates(ridePath);

  const stopInfo = getRouteDetails(ridePath, ridePathIds, stationMap);

  return { rideId, departureDate, arrivalDate, stopInfo };
}
