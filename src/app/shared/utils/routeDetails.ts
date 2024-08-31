import { Segment, StopInfo } from '@/core/models/search.model';
import { StationMap } from '@/core/models/stations.model';

export default function getRouteDetails(
  ridePath: Segment[],
  ridePathIds: number[],
  stationsMap: StationMap,
): StopInfo[] {
  return ridePath.map((segment, i) => {
    const station = stationsMap[ridePathIds[i]].city;

    let arrivalOnStation: string | undefined;
    let departureFromStation: string | undefined;
    let stopDuration: number | 'First station' | 'Last station';

    const getTime = (ISOString: string) => ISOString.split('T')[1].slice(0, 5);

    if (i === 0) {
      departureFromStation = getTime(segment.time[0]);
      stopDuration = 'First station';
    } else if (i === ridePath.length - 1) {
      arrivalOnStation = getTime(segment.time[1]);
      stopDuration = 'Last station';
    } else {
      arrivalOnStation = getTime(ridePath[i - 1].time[1]);
      departureFromStation = getTime(segment.time[0]);
      stopDuration =
        new Date(segment.time[0]).getTime() -
        new Date(ridePath[i - 1].time[1]).getTime();
    }

    return {
      station,
      departureFromStation,
      arrivalOnStation,
      stopDuration,
    };
  });
}
