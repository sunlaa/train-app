import { RoutesState } from '@/redux/reducers';
import MockRoutesData from './mock-routes-data';

export default class MockRoutesState {
  static successState: RoutesState = {
    routes: MockRoutesData.routes,
    status: 'success',
    error: null,
  };

  static loadingState: RoutesState = {
    routes: MockRoutesData.routes,
    status: 'loading',
    error: null,
  };

  static errorState: RoutesState = {
    routes: MockRoutesData.routes,
    status: 'error',
    error: { message: 'Some error', reason: 'someError' },
  };
}
