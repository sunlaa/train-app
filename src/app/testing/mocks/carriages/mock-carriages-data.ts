import {
  CarriageMap,
  TCarriage,
  TCarriageWithSeats,
} from '@/core/models/carriages.model';

export default class MockCarriagesData {
  static carriages: TCarriage[] = [
    {
      code: 'A1',
      name: 'Economy Class',
      rows: 10,
      leftSeats: 5,
      rightSeats: 5,
    },
    {
      code: 'B2',
      name: 'Business Class',
      rows: 6,
      leftSeats: 3,
      rightSeats: 3,
    },
    {
      code: 'C3',
      name: 'First Class',
      rows: 4,
      leftSeats: 2,
      rightSeats: 2,
    },
  ];

  static carriagesWithSeats: TCarriageWithSeats[] = [
    {
      code: 'A1',
      name: 'Economy Class',
      rows: 10,
      leftSeats: 5,
      rightSeats: 5,
      seats: 100,
    },
    {
      code: 'B2',
      name: 'Business Class',
      rows: 6,
      leftSeats: 3,
      rightSeats: 3,
      seats: 36,
    },
    {
      code: 'C3',
      name: 'First Class',
      rows: 4,
      leftSeats: 2,
      rightSeats: 2,
      seats: 16,
    },
  ];

  static carriageMap: CarriageMap = {
    A1: {
      code: 'A1',
      name: 'Economy Class',
      rows: 10,
      leftSeats: 5,
      rightSeats: 5,
      seats: 100,
    },
    B2: {
      code: 'B2',
      name: 'Business Class',
      rows: 6,
      leftSeats: 3,
      rightSeats: 3,
      seats: 36,
    },
    C3: {
      code: 'C3',
      name: 'First Class',
      rows: 4,
      leftSeats: 2,
      rightSeats: 2,
      seats: 16,
    },
  };
}
