import {
  TRidePrice,
  TRideSegment,
  TRide,
  TRouteRides,
} from '@/core/models/rides.model';

export default class MockRidesData {
  static ridePrices: TRidePrice[] = [
    { economy: 50, business: 100 },
    { economy: 60, business: 120 },
    { economy: 70, business: 140 },
  ];

  static rideSegments: TRideSegment[] = [
    {
      time: ['2024-09-01T08:00:00Z', '2024-09-01T10:00:00Z'],
      price: this.ridePrices[0],
    },
    {
      time: ['2024-09-01T11:00:00Z', '2024-09-01T13:00:00Z'],
      price: this.ridePrices[1],
    },
    {
      time: ['2024-09-01T14:00:00Z', '2024-09-01T16:00:00Z'],
      price: this.ridePrices[2],
    },
  ];

  static rides: TRide[] = [
    {
      id: 1,
      segments: [this.rideSegments[0], this.rideSegments[1]],
    },
    {
      id: 2,
      segments: [this.rideSegments[1], this.rideSegments[2]],
    },
    {
      id: 3,
      segments: [this.rideSegments[0], this.rideSegments[2]],
    },
  ];

  static routeRides: TRouteRides = {
    id: 1,
    carriages: ['A1', 'B2', 'C3'],
    path: [1, 2, 3],
    schedule: [
      {
        rideId: 1,
        segments: [this.rideSegments[0], this.rideSegments[1]],
      },
      {
        rideId: 2,
        segments: [this.rideSegments[1], this.rideSegments[2]],
      },
      {
        rideId: 3,
        segments: [this.rideSegments[0], this.rideSegments[2]],
      },
    ],
  };
}
