import { CarriageData, Segment } from './search.model';

export type RideResponse = {
  rideId: number;
  path: number[];
  carriages: string[];
  schedule: RideSchedule;
};

export type RideSchedule = {
  segments: Segment[];
};

export type TrainCarriageData = {
  code: string;
  carNumber: number;
  emptySeats: number;
  occupiedSeats: number[];
};

export type RideCarriageData = {
  header: CarriageData;
  carriages: TrainCarriageData[];
  carriageView: { rows: number; leftSeats: number; rightSeats: number };
};
