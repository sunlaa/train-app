import { Schedule, Order } from '@/core/models/orders.model';
import { Segment } from '@/core/models/search.model';
import { TUser } from '@/core/models/users.model';

export default class MockOrdersData {
  static segments: Segment[] = [
    {
      time: ['2024-09-09T08:00:00Z', '2024-09-09T10:00:00Z'],
      price: { standard: 50, premium: 100 },
      occupiedSeats: [1, 2, 3],
    },
    {
      time: ['2024-09-09T10:15:00Z', '2024-09-09T12:00:00Z'],
      price: { standard: 60, premium: 120 },
      occupiedSeats: [4, 5, 6],
    },
  ];

  static schedule: Schedule = {
    segments: [
      {
        time: ['2024-09-09T08:00:00Z', '2024-09-09T10:00:00Z'],
        price: { standard: 50, premium: 100 },
      },
      {
        time: ['2024-09-09T10:15:00Z', '2024-09-09T12:00:00Z'],
        price: { standard: 60, premium: 120 },
      },
    ],
  };

  static orders: Order[] = [
    {
      id: 1,
      rideId: 101,
      routeId: 202,
      seatId: 12,
      userId: 555,
      status: 'active',
      path: [101, 102, 103],
      carriages: ['A', 'B'],
      stationStart: 101,
      stationEnd: 103,
      schedule: MockOrdersData.schedule,
    },
    {
      id: 2,
      rideId: 102,
      routeId: 203,
      seatId: 15,
      userId: 556,
      status: 'completed',
      path: [104, 105],
      carriages: ['B'],
      stationStart: 104,
      stationEnd: 105,
      schedule: MockOrdersData.schedule,
    },
  ];

  static users: TUser[] = [
    {
      id: 1,
      email: 'admin@admin.com',
      name: 'Admin',
      role: 'manager',
    },
    {
      id: 2,
      email: 'totallylegit@gmail.com',
      name: 'John',
      role: 'user',
    },
  ];
}
