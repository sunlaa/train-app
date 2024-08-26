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
  time: [string, string];
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
  carriages: CarriageData[];
  routeDetails: RouteDetails;
};

export type CarriageData = {
  name: string;
  price: number;
  freeSeats: number;
};

export type RouteDetails = {
  routeId: number;
  stopInfo: StopInfo[];
};

export type StopInfo = {
  station: string;
  arrivalOnStation: string | undefined;
  departureFromStation: string | undefined;
  stopDuration: number | 'First station' | 'Last station';
};

export type DayTickets = {
  date: string;
  tickets: Ticket[];
};

export type FilteredTickets = DayTickets[];
