import { RidesState } from '@/redux/reducers';
import MockRidesData from './mock-rides-data';

export default class MockRidesState {
  static successState: RidesState = {
    route: MockRidesData.routeRides,
    status: 'success',
    error: null,
  };

  static loadingState: RidesState = {
    route: MockRidesData.routeRides,
    status: 'loading',
    error: null,
  };

  static errorState: RidesState = {
    route: MockRidesData.routeRides,
    status: 'error',
    error: { message: 'Some error', reason: 'someError' },
  };
}
