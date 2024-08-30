import { CarriageData, Segment, StopInfo } from './search.model';

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
  itemHeader: CarriageData;
  carriages: TrainCarriageData[];
  carriageView: { rows: number; leftSeats: number; rightSeats: number };
};

export type RideHeader = {
  rideId: number;
  departureDate: Date;
  arrivalDate: Date;
  stopInfo: StopInfo[];
};

export type RidePageData = {
  header: RideHeader;
  carriageList: RideCarriageData[];
};
