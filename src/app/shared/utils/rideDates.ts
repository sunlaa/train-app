import { Segment } from '@/core/models/search.model';

export default function getRideDates(ridePath: Pick<Segment, 'time'>[]) {
  const departureDate = new Date(ridePath[0].time[0]).getTime();
  const arrivalDate = new Date(ridePath[ridePath.length - 1].time[1]).getTime();

  return { departureDate, arrivalDate };
}
