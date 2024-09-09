import { CarriageMap } from '@/core/models/carriages.model';
import {
  FilteredTickets,
  SearchResponse,
  Ticket,
} from '@/core/models/search.model';
import { StationMap } from '@/core/models/stations.model';

export const mockParams = {
  fromLatitude: -41.52982147162061,
  fromLongitude: 138.3447559557194,
  toLatitude: 45.992723543798576,
  toLongitude: 16.20726213693945,
  time: 123456789,
};

export const mockStationMap: StationMap = {
  2: {
    city: 'city2',
    id: 2,
    latitude: -41.52982147162061,
    longitude: 138.3447559557194,
    connectedTo: [],
  },
  3: {
    city: 'city3',
    id: 3,
    latitude: -41.52982147162061,
    longitude: 138.3447559557194,
    connectedTo: [],
  },
  4: {
    id: 4,
    city: 'city4',
    latitude: 45.992723543798576,
    longitude: 16.20726213693945,
    connectedTo: [],
  },
  5: {
    city: 'city5',
    id: 5,
    latitude: -41.52982147162061,
    longitude: 138.3447559557194,
    connectedTo: [],
  },
  6: {
    city: 'city6',
    id: 6,
    latitude: -41.52982147162061,
    longitude: 138.3447559557194,
    connectedTo: [],
  },
};

export const mockCarriageMap: CarriageMap = {
  carriage1: {
    code: 'carriage1',
    name: 'carriage1',
    rows: 10,
    leftSeats: 2,
    rightSeats: 2,
    seats: 40,
  },
  carriage2: {
    code: 'carriage2',
    name: 'carriage2',
    rows: 12,
    leftSeats: 2,
    rightSeats: 3,
    seats: 60,
  },
};

export const mockSearchResponse: SearchResponse = {
  from: {
    stationId: 2,
    city: 'city2',
    geolocation: {
      latitude: -41.52982147162061,
      longitude: 138.3447559557194,
    },
  },
  to: {
    stationId: 4,
    city: 'city4',
    geolocation: {
      latitude: 45.992723543798576,
      longitude: 16.20726213693945,
    },
  },
  routes: [
    {
      path: [2, 3, 5, 4],
      carriages: [
        'carriage1',
        'carriage2',
        'carriage1',
        'carriage2',
        'carriage2',
        'carriage1',
        'carriage1',
        'carriage1',
      ],
      id: 87,
      schedule: [
        {
          rideId: 319,
          segments: [
            {
              time: ['2024-09-03T07:44:55.341Z', '2024-09-05T19:27:55.341Z'],
              price: {
                carriage1: 260,
                carriage2: 2265,
              },
              occupiedSeats: [],
            },
            {
              time: ['2024-09-05T19:42:55.341Z', '2024-09-08T02:00:55.341Z'],
              price: {
                carriage1: 1636,
                carriage2: 550,
              },
              occupiedSeats: [],
            },
            {
              time: ['2024-09-08T02:59:55.341Z', '2024-09-10T12:07:55.341Z'],
              price: {
                carriage1: 1266,
                carriage2: 2386,
              },
              occupiedSeats: [],
            },
          ],
        },
      ],
    },
    {
      path: [6, 2, 3, 5, 4],
      carriages: [
        'carriage1',
        'carriage1',
        'carriage2',
        'carriage1',
        'carriage1',
      ],
      id: 87,
      schedule: [
        {
          rideId: 319,
          segments: [
            {
              time: ['2024-09-04T07:44:55.341Z', '2024-09-06T19:27:55.341Z'],
              price: {
                carriage1: 260,
                carriage2: 2265,
              },
              occupiedSeats: [],
            },
            {
              time: ['2024-09-06T19:42:55.341Z', '2024-09-09T02:00:55.341Z'],
              price: {
                carriage1: 1636,
                carriage2: 550,
              },
              occupiedSeats: [],
            },
            {
              time: ['2024-09-09T02:59:55.341Z', '2024-09-10T12:07:55.341Z'],
              price: {
                carriage1: 1266,
                carriage2: 2386,
              },
              occupiedSeats: [],
            },
            {
              time: ['2024-09-10T12:42:55.341Z', '2024-09-13T13:50:55.341Z'],
              price: {
                carriage1: 476,
                carriage2: 549,
              },
              occupiedSeats: [],
            },
          ],
        },
      ],
    },
  ],
};

export const mockHandledTicketsData: Ticket[] = [
  {
    arrivalDate: 1725970075341,
    carriages: [
      { freeSeats: 200, name: 'carriage1', price: 3162 },
      { freeSeats: 180, name: 'carriage2', price: 5201 },
    ],
    departureDate: 1725349495341,
    endCity: 'city4',
    firstRouteStation: 'city2',
    fromId: 2,
    lastRouteStation: 'city4',
    rideId: 319,
    routeDetails: {
      routeId: 87,
      stopInfo: [
        {
          arrivalOnStation: undefined,
          departureFromStation: '07:44',
          station: 'city2',
          stopDuration: 'First station',
        },
        {
          arrivalOnStation: '19:27',
          departureFromStation: '19:42',
          station: 'city3',
          stopDuration: 900000,
        },
        {
          arrivalOnStation: '02:00',
          departureFromStation: '02:59',
          station: 'city5',
          stopDuration: 3540000,
        },
        {
          arrivalOnStation: '12:07',
          departureFromStation: undefined,
          station: 'city4',
          stopDuration: 'Last station',
        },
      ],
    },
    startCity: 'city2',
    toId: 4,
    tripDuration: 620580000,
  },
  {
    arrivalDate: 1726235455341,
    carriages: [
      { freeSeats: 160, name: 'carriage1', price: 3378 },
      { freeSeats: 60, name: 'carriage2', price: 3485 },
    ],
    departureDate: 1725651775341,
    endCity: 'city4',
    firstRouteStation: 'city6',
    fromId: 2,
    lastRouteStation: 'city4',
    rideId: 319,
    routeDetails: {
      routeId: 87,
      stopInfo: [
        {
          arrivalOnStation: undefined,
          departureFromStation: '19:42',
          station: 'city2',
          stopDuration: 'First station',
        },
        {
          arrivalOnStation: '02:00',
          departureFromStation: '02:59',
          station: 'city3',
          stopDuration: 3540000,
        },
        {
          arrivalOnStation: '12:07',
          departureFromStation: '12:42',
          station: 'city5',
          stopDuration: 2100000,
        },
        {
          arrivalOnStation: '13:50',
          departureFromStation: undefined,
          station: 'city4',
          stopDuration: 'Last station',
        },
      ],
    },
    startCity: 'city2',
    toId: 4,
    tripDuration: 583680000,
  },
];

export const handledMockResponse: FilteredTickets = [
  {
    date: 1725321600000,
    tickets: [
      {
        arrivalDate: 1725970075341,
        carriages: [
          { freeSeats: 200, name: 'carriage1', price: 3162 },
          { freeSeats: 180, name: 'carriage2', price: 5201 },
        ],
        departureDate: 1725349495341,
        endCity: 'city4',
        firstRouteStation: 'city2',
        fromId: 2,
        lastRouteStation: 'city4',
        rideId: 319,
        routeDetails: {
          routeId: 87,
          stopInfo: [
            {
              arrivalOnStation: undefined,
              departureFromStation: '07:44',
              station: 'city2',
              stopDuration: 'First station',
            },
            {
              arrivalOnStation: '19:27',
              departureFromStation: '19:42',
              station: 'city3',
              stopDuration: 900000,
            },
            {
              arrivalOnStation: '02:00',
              departureFromStation: '02:59',
              station: 'city5',
              stopDuration: 3540000,
            },
            {
              arrivalOnStation: '12:07',
              departureFromStation: undefined,
              station: 'city4',
              stopDuration: 'Last station',
            },
          ],
        },
        startCity: 'city2',
        toId: 4,
        tripDuration: 620580000,
      },
    ],
  },
  {
    date: 1725580800000,
    tickets: [
      {
        arrivalDate: 1726235455341,
        carriages: [
          { freeSeats: 160, name: 'carriage1', price: 3378 },
          { freeSeats: 60, name: 'carriage2', price: 3485 },
        ],
        departureDate: 1725651775341,
        endCity: 'city4',
        firstRouteStation: 'city6',
        fromId: 2,
        lastRouteStation: 'city4',
        rideId: 319,
        routeDetails: {
          routeId: 87,
          stopInfo: [
            {
              arrivalOnStation: undefined,
              departureFromStation: '19:42',
              station: 'city2',
              stopDuration: 'First station',
            },
            {
              arrivalOnStation: '02:00',
              departureFromStation: '02:59',
              station: 'city3',
              stopDuration: 3540000,
            },
            {
              arrivalOnStation: '12:07',
              departureFromStation: '12:42',
              station: 'city5',
              stopDuration: 2100000,
            },
            {
              arrivalOnStation: '13:50',
              departureFromStation: undefined,
              station: 'city4',
              stopDuration: 'Last station',
            },
          ],
        },
        startCity: 'city2',
        toId: 4,
        tripDuration: 583680000,
      },
    ],
  },
];
