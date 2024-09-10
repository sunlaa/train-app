import { RidePageData, RideResponse } from '@/core/models/trip.model';
import { mockCarriageMap } from '../search';

export const mockTripPageData: RidePageData = {
  carriages: ['carriage1', 'carriage2'],
  carriageMap: mockCarriageMap,
  header: {
    routeId: 222,
    rideId: 1,
    departureDate: 1234567,
    arrivalDate: 234567,
    stopInfo: [],
  },
  carriageList: [],
};

export const mockParamMap = {
  get: () => '1',
};

export const mockQueryParamMap = {
  get: (key: string) => {
    if (key === 'from') return '2';
    if (key === 'to') return '4';
    return undefined;
  },
};

export const mockRideResponse: RideResponse = {
  routeId: 127,
  rideId: 449,
  path: [2, 4, 3, 5],
  carriages: [
    'carriage2',
    'carriage2',
    'carriage1',
    'carriage1',
    'carriage1',
    'carriage2',
  ],
  schedule: {
    segments: [
      {
        time: ['2024-08-24T07:35:05.361Z', '2024-08-27T12:50:05.361Z'],
        price: {
          carriage2: 2117,
          carriage1: 2422,
        },
        occupiedSeats: [],
      },
      {
        time: ['2024-08-27T13:22:05.361Z', '2024-08-30T13:10:05.361Z'],
        price: {
          carriage2: 1636,
          carriage1: 1109,
        },
        occupiedSeats: [],
      },
      {
        time: ['2024-08-30T13:57:05.361Z', '2024-08-31T04:16:05.361Z'],
        price: {
          carriage2: 1069,
          carriage1: 2171,
        },
        occupiedSeats: [],
      },
    ],
  },
};

export const handledMockResponse: RidePageData = {
  carriageList: [
    {
      carriageView: { leftSeats: 2, rightSeats: 3, rows: 12 },
      carriages: [
        { carNumber: 1, code: 'carriage2', emptySeats: 60, occupiedSeats: [] },
        { carNumber: 2, code: 'carriage2', emptySeats: 60, occupiedSeats: [] },
        { carNumber: 6, code: 'carriage2', emptySeats: 60, occupiedSeats: [] },
      ],
      itemHeader: { freeSeats: 180, name: 'carriage2', price: 4822 },
    },
    {
      carriageView: { leftSeats: 2, rightSeats: 2, rows: 10 },
      carriages: [
        { carNumber: 3, code: 'carriage1', emptySeats: 40, occupiedSeats: [] },
        { carNumber: 4, code: 'carriage1', emptySeats: 40, occupiedSeats: [] },
        { carNumber: 5, code: 'carriage1', emptySeats: 40, occupiedSeats: [] },
      ],
      itemHeader: { freeSeats: 120, name: 'carriage1', price: 5702 },
    },
  ],
  carriageMap: {
    carriage1: {
      code: 'carriage1',
      leftSeats: 2,
      name: 'carriage1',
      rightSeats: 2,
      rows: 10,
      seats: 40,
    },
    carriage2: {
      code: 'carriage2',
      leftSeats: 2,
      name: 'carriage2',
      rightSeats: 3,
      rows: 12,
      seats: 60,
    },
  },
  carriages: [
    'carriage2',
    'carriage2',
    'carriage1',
    'carriage1',
    'carriage1',
    'carriage2',
  ],
  header: {
    arrivalDate: 1725077765361,
    departureDate: 1724484905361,
    rideId: 449,
    routeId: 127,
    stopInfo: [
      {
        arrivalOnStation: undefined,
        departureFromStation: '07:35',
        station: 'city2',
        stopDuration: 'First station',
      },
      {
        arrivalOnStation: '12:50',
        departureFromStation: '13:22',
        station: 'city4',
        stopDuration: 1920000,
      },
      {
        arrivalOnStation: '13:10',
        departureFromStation: '13:57',
        station: 'city3',
        stopDuration: 2820000,
      },
      {
        arrivalOnStation: '04:16',
        departureFromStation: undefined,
        station: 'city5',
        stopDuration: 'Last station',
      },
    ],
  },
};
