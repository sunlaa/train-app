import { TRoute } from '@/core/models/routes.model';

export default class MockRoutesData {
  static routes: TRoute[] = [
    {
      id: 1,
      path: [1, 2, 3],
      carriages: ['A1', 'B2', 'C3'],
    },
    {
      id: 2,
      path: [2, 3, 4],
      carriages: ['B2', 'C3'],
    },
    {
      id: 3,
      path: [4, 2, 1],
      carriages: ['A1'],
    },
  ];
}
