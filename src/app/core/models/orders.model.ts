import { Segment } from './search.model';

export type Order = {
  id: number;
  rideId: number;
  routeId: number;
  seatId: number;
  userId: number;
  status: 'active' | 'completed' | 'rejected' | 'canceled';
  path: number[];
  carriages: string[];
  schedule: Schedule;
};

export type Schedule = {
  segments: Omit<Segment, 'occupiedSeats'>[];
};

export type MakeOrderBody = {
  rideId: number;
  seat: number;
  stationStart: number;
  stationEnd: number;
};
