import { TRoute } from './routes.model';

export type TRidePrice = Record<string, number>;

export type TRideSegment = {
  time: [string, string];
  price: TRidePrice;
};

export type TRide = {
  id: number;
  segments: TRideSegment[];
};

export type TRouteRide = {
  rideId: number;
  segments: TRideSegment[];
};

export type TRouteRides = TRoute & {
  schedule: TRouteRide[];
};

export type TTimeData = {
  time: string;
  index: number;
};

export type TStationSegmentData = {
  id: number;
  name: string;
  departure: TTimeData | undefined;
  arrival: TTimeData | undefined;
};

export type TPriceSegmentData = {
  carriages: Entry<string>[];
  price: TRidePrice;
  index: number;
};

export type TCarriagePrice = {
  id: string;
  carriage: string;
  price: number;
};

export type Entry<T extends string | number> = {
  id: T;
  name: string;
};
