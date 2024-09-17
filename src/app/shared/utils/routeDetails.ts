import { Segment, StopInfo } from '@/core/models/search.model';
import { StationMap } from '@/core/models/stations.model';

export default function getRouteDetails(
  ridePath: Segment[],
  ridePathIds: number[],
  stationsMap: StationMap,
): StopInfo[] {
  let prevArrivaleOnStation: string | undefined;

  return ridePathIds.map((id, i) => {
    const station = stationsMap[id].city;

    let arrivalOnStation: string | undefined;
    let departureFromStation: string | undefined;
    let stopDuration: number | 'First station' | 'Last station';

    const getTime = (ISOString: string) => ISOString.split('T')[1].slice(0, 5);
    const getDuration = (departure: string, arrival: string) =>
      new Date(departure).getTime() - new Date(arrival).getTime();

    const segment = ridePath[i];

    if (segment) {
      arrivalOnStation =
        prevArrivaleOnStation && getTime(prevArrivaleOnStation);

      departureFromStation = getTime(segment.time[0]);
      stopDuration =
        i === 0
          ? 'First station'
          : getDuration(segment.time[0], prevArrivaleOnStation ?? '');

      prevArrivaleOnStation = segment.time[1];
    } else {
      arrivalOnStation = getTime(prevArrivaleOnStation ?? '');
      departureFromStation = undefined;
      stopDuration = 'Last station';
    }

    return {
      station,
      departureFromStation,
      arrivalOnStation,
      stopDuration,
    };
  });
}
