import { Segment } from './search.model';

export type RideResponse = {
  rideId: number;
  path: number[];
  carriage: string[];
  schedule: RideSchedule;
};

export type RideSchedule = {
  segments: Segment[];
};

export type TrainCarriageData = {
  code: string;
  carNumer: number;
  emptySeats: number;
  occupiedSeats: number[];
};

export type SeatsDataByType = {
  [code: string]: Omit<TrainCarriageData, 'code'>[];
};
