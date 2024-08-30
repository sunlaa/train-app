import { Segment } from '@/core/models/search.model';

export default function getRideDates(ridePath: Segment[]) {
  const departureDate = new Date(ridePath[0].time[0]);
  const arrivalDate = new Date(ridePath[ridePath.length - 1].time[1]);

  return { departureDate, arrivalDate };
}
