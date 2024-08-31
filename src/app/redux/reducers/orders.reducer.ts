import { ApiError } from '@/core/models/api.model';
import { Order } from '@/core/models/orders.model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { ordersActions } from '../actions/orders.actions';

export type OrderState = {
  orders: Order[];
  error: ApiError | Error | null;
  status: 'loading' | 'error' | 'success';
};

const initialState: OrderState = {
  orders: [],
  error: null,
  status: 'loading',
};

const orderReducer = createReducer(
  initialState,
  on(
    ordersActions.load,
    (state): OrderState => ({ ...state, status: 'loading' }),
  ),
  on(
    ordersActions.loadSuccess,
    (_, { orders }): OrderState => ({
      orders,
      error: null,
      status: 'success',
    }),
  ),
  on(
    ordersActions.loadError,
    (state, { error }): OrderState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),

  on(
    ordersActions.makeOrder,
    (state): OrderState => ({ ...state, status: 'loading' }),
  ),
  on(
    ordersActions.orderSuccess,
    (_, { orders }): OrderState => ({
      orders,
      error: null,
      status: 'success',
    }),
  ),
  on(
    ordersActions.orderError,
    (state, { error }): OrderState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),

  on(
    ordersActions.deleteOrder,
    (state): OrderState => ({ ...state, status: 'loading' }),
  ),
  on(
    ordersActions.deleteOrderSuccess,
    (state, { id }): OrderState => ({
      orders: state.orders.filter((order) => order.id !== id),
      error: null,
      status: 'success',
    }),
  ),
  on(
    ordersActions.deleteOrderError,
    (state, { error }): OrderState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
);

export const ordersFeature = createFeature({
  name: 'orders',
  reducer: orderReducer,
});
