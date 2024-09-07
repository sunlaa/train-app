import { CarriagesState } from '@/redux/reducers';
import MockCarriagesData from './mock-carriages-data';

export default class MockCarriagesState {
  static successState: CarriagesState = {
    carriages: MockCarriagesData.carriages,
    status: 'success',
    error: null,
  };

  static loadingState: CarriagesState = {
    carriages: MockCarriagesData.carriages,
    status: 'loading',
    error: null,
  };

  static errorState: CarriagesState = {
    carriages: MockCarriagesData.carriages,
    status: 'error',
    error: { message: 'Some error', reason: 'someError' },
  };
}
