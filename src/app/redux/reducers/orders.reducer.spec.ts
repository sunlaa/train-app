import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '@/core/models/api.model';
import { MockOrdersData } from '@/testing/mocks';
import { Order } from '@/core/models/orders.model';
import { ordersFeature, OrderState } from './orders.reducer';
import { ordersActions } from '../actions/orders.actions';

describe('OrdersReducer', () => {
  let initialState: OrderState;
  const genericApiError: ApiError = {
    message: 'Error with orders',
    reason: 'ordersError',
  };

  beforeEach(() => {
    initialState = {
      orders: [],
      error: null,
      status: 'loading',
    };
  });

  // Load actions

  it('should set loading status when load action with "all = false" is dispatched', () => {
    const action = ordersActions.load({ all: false });
    const newState = ordersFeature.reducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      status: 'loading',
    });
  });

  it('should set loading status when load action with "all = true" is dispatched', () => {
    const action = ordersActions.load({ all: true });
    const newState = ordersFeature.reducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      status: 'loading',
    });
  });

  it('should update orders and set success status when loadSuccess action is dispatched', () => {
    const { orders } = MockOrdersData;

    const state = ordersFeature.reducer(
      initialState,
      ordersActions.loadSuccess({ orders }),
    );

    expect(state).toEqual({
      orders,
      error: null,
      status: 'success',
    });
  });

  it('should set error and status when loadError action is dispatched', () => {
    const error = new HttpErrorResponse({ error: genericApiError });

    const state = ordersFeature.reducer(
      initialState,
      ordersActions.loadError({ error }),
    );

    expect(state).toEqual({
      ...initialState,
      error: genericApiError,
      status: 'error',
    });
  });

  // Make order actions

  it('should set loading status when make order action is dispatched', () => {
    const order = { ...MockOrdersData.orders[0], seat: 1 };

    const state = ordersFeature.reducer(
      initialState,
      ordersActions.makeOrder({
        order,
      }),
    );

    expect(state).toEqual({
      ...initialState,
      status: 'loading',
    });
  });

  it('should add an order and set success status when orderSuccess action is dispatched', () => {
    const order = { ...MockOrdersData.orders[0], seat: 1 };

    const state = ordersFeature.reducer(
      initialState,
      ordersActions.orderSuccess({ orders: [order] }),
    );

    expect(state).toEqual({
      orders: [order],
      error: null,
      status: 'success',
    });
  });

  it('should set error and status when orderError action is dispatched', () => {
    const error = new HttpErrorResponse({ error: genericApiError });

    const state = ordersFeature.reducer(
      initialState,
      ordersActions.orderError({ error }),
    );

    expect(state).toEqual({
      ...initialState,
      error: genericApiError,
      status: 'error',
    });
  });

  // Cancel actions

  it('should set loading status when cancelOrder action is dispatched', () => {
    const { id } = MockOrdersData.orders[0];

    const state = ordersFeature.reducer(
      initialState,
      ordersActions.cancelOrder({
        id,
      }),
    );

    expect(state).toEqual({
      ...initialState,
      status: 'loading',
    });
  });

  it('should cancel an order when cancelOrderSuccess action is dispatched', () => {
    const order = MockOrdersData.orders[0];
    const newOrder: Order = { ...order, status: 'canceled' };
    const orders = MockOrdersData.orders.slice(0, 2);
    const previousState: OrderState = {
      ...initialState,
      orders,
    };

    const state = ordersFeature.reducer(
      previousState,
      ordersActions.cancelOrderSuccess({ id: order.id }),
    );

    expect(state).toEqual({
      ...previousState,
      orders: [newOrder, orders[1]],
      error: null,
      status: 'success',
    });
  });

  it('should set error and status when cancelOrderError action is dispatched', () => {
    const error = new HttpErrorResponse({ error: genericApiError });

    const state = ordersFeature.reducer(
      initialState,
      ordersActions.cancelOrderError({ error }),
    );

    expect(state).toEqual({
      ...initialState,
      error: genericApiError,
      status: 'error',
    });
  });
});
