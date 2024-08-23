import { TRoute } from './routes.model';

export type SearchRequest = {
  fromLatitude: number;
  fromLongitude: number;
  toLatitude: number;
  toLongitude: number;
  time: string;
};

export type SearchResponse = {
  from: Location;
  to: Location;
  routes: SearchRoute[];
};

export type Location = {
  stationId: number;
  city: string;
  geolocation: {
    latitude: number;
    longitude: number;
  };
};

export type SearchRoute = {
  schedule: Ride[];
} & TRoute;

export type Ride = {
  rideId: number;
  segments: Segment[];
};

export type Segment = {
  time: string[];
  price: { [key: string]: number };
  occupiedSeats: number[];
};

export type Ticket = {
  departureDate: Date;
  arrivalDate: Date;
  startCity: string;
  endCity: string;
  tripDuration: number;
  firstRouteStation: string;
  lastRouteStation: string;
  // temporarily
  price?: { [key: string]: number };
};

export type FilteredTickets = { [key: string]: Ticket[] };
