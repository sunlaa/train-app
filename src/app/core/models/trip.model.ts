import { CarriageMap } from './carriages.model';
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
  departureDate: number;
  arrivalDate: number;
  stopInfo: StopInfo[];
};

export type RidePageData = {
  carriages: string[];
  carriageMap: CarriageMap;
  header: RideHeader;
  carriageList: RideCarriageData[];
};

export type SeatEventData = {
  seat: number;
  carNumber: number;
  seatIndex: number;
};

export type SelectedSeat = {
  seat: number;
  carNumber: number;
};

export type OccupiedSeat = {
  seat: number;
  carNumber: number;
};
