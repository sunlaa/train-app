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
  stationStart: number;
  stationEnd: number;
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

export type TTagSeverity =
  | 'info'
  | 'success'
  | 'danger'
  | 'warning'
  | 'contrast';
