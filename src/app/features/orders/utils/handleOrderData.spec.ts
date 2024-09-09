import { CarriageMap } from '@/core/models/carriages.model';
import { Order } from '@/core/models/orders.model';
import { StationMap } from '@/core/models/stations.model';
import { TUser } from '@/core/models/users.model';
import handleOrderData from './handleOrderData';

// Mock data
const mockOrder: Order = {
  id: 1,
  rideId: 101,
  routeId: 202,
  seatId: 12,
  userId: 1,
  status: 'active',
  path: [1, 2, 3],
  carriages: ['A', 'B'],
  stationStart: 1,
  stationEnd: 3,
  schedule: {
    segments: [
      {
        time: ['2023-01-01T10:00:00Z', '2023-01-01T11:00:00Z'],
        price: { A: 50, B: 70 },
      },
      {
        time: ['2023-01-01T11:00:00Z', '2023-01-01T12:00:00Z'],
        price: { A: 60, B: 80 },
      },
    ],
  },
};

const mockStationMap: StationMap = {
  1: { id: 1, city: 'Station A', connectedTo: [], latitude: 0, longitude: 0 },
  2: { id: 2, city: 'Station B', connectedTo: [], latitude: 0, longitude: 0 },
  3: { id: 3, city: 'Station C', connectedTo: [], latitude: 0, longitude: 0 },
};

const mockCarriageMap: CarriageMap = {
  A: {
    code: 'A',
    name: 'First Class',
    rows: 10,
    leftSeats: 2,
    rightSeats: 2,
    seats: 20,
  },
  B: {
    code: 'B',
    name: 'Second Class',
    rows: 12,
    leftSeats: 2,
    rightSeats: 2,
    seats: 24,
  },
};

const mockUsers: TUser[] = [
  { id: 1, email: 'user1@example.com', name: 'John Doe', role: 'user' },
  { id: 2, email: 'user2@example.com', name: 'Jane Smith', role: 'manager' },
];

// Test case
describe('handleOrderData', () => {
  it('should return correct order data', () => {
    const result = handleOrderData(
      mockOrder,
      mockStationMap,
      mockCarriageMap,
      mockUsers,
    );

    expect(result).toEqual({
      orderId: 1,
      startCity: 'Station A',
      endCity: 'Station C',
      startTripTime: new Date('2023-01-01T10:00:00Z').getTime(),
      endTripTime: new Date('2023-01-01T12:00:00Z').getTime(),
      tripDuration: 7200000, // 2 hours in milliseconds
      carriageType: 'First Class',
      carNumber: 1,
      seatNumber: 12,
      price: 110, // Sum of prices for carriage A
      owner: 'John Doe',
      status: 'active',
    });
  });

  it('should mask the email if the user has no name', () => {
    const modifiedMockUsers: TUser[] = [
      { id: 1, email: 'user1@example.com', name: '', role: 'user' },
    ];
    const result = handleOrderData(
      mockOrder,
      mockStationMap,
      mockCarriageMap,
      modifiedMockUsers,
    );

    expect(result.owner).toBe('u*****1@example.com');
  });
});
