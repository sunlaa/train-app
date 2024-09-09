import { OrderState } from '@/redux/reducers/orders.reducer';
import MockOrdersData from './mock-orders-data';

export default class MockOrdersState {
  static successState: OrderState = {
    orders: MockOrdersData.orders,
    status: 'success',
    error: null,
  };

  static loadingState: OrderState = {
    orders: MockOrdersData.orders,
    status: 'loading',
    error: null,
  };

  static errorState: OrderState = {
    orders: MockOrdersData.orders,
    status: 'error',
    error: { message: 'Some error', reason: 'someError' },
  };
}
