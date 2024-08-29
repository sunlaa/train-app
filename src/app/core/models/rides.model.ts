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
  name: string;
  departure: TTimeData | undefined;
  arrival: TTimeData | undefined;
};

export type TPriceSegmentData = {
  carriages: string[];
  price: TRidePrice;
  index: number;
};

export type TCarriagePrice = {
  carriage: string;
  price: number;
};
