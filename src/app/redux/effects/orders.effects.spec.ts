import { MockOrdersData } from '@/testing/mocks';
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { of, throwError } from 'rxjs';
import { OrdersService } from '@/features/orders/services/orders/orders.service';
import { OrdersEffects } from './orders.effects';
import { ordersActions } from '../actions/orders.actions';

describe('OrdersEffects', () => {
  let actions$: Actions<Action<string>>;
  let effects: OrdersEffects;
  let ordersService: jest.Mocked<OrdersService>;

  beforeEach(() => {
    const ordersServiceMock = {
      getOrders: jest.fn(),
      makeOrder: jest.fn(),
      deleteOrder: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        OrdersEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: OrdersService, useValue: ordersServiceMock },
      ],
    });

    effects = TestBed.inject(OrdersEffects);
    ordersService = TestBed.inject(OrdersService) as jest.Mocked<OrdersService>;
  });

  it('should dispatch loadSuccess on successful orders load', (done) => {
    const { orders } = MockOrdersData;
    ordersService.getOrders.mockReturnValue(of(orders));
    actions$ = of(ordersActions.load({ all: false }));

    effects.loadOrders$.subscribe((result) => {
      expect(result).toEqual(ordersActions.loadSuccess({ orders }));
      done();
    });
  });

  it('should dispatch loadError on failed orders load', (done) => {
    const errorResponse = new HttpErrorResponse({ error: 'Error' });
    ordersService.getOrders.mockReturnValue(throwError(() => errorResponse));
    actions$ = of(ordersActions.load({ all: false }));

    effects.loadOrders$.subscribe((result) => {
      expect(result).toEqual(ordersActions.loadError({ error: errorResponse }));
      done();
    });
  });

  it('should dispatch orderSuccess on successful order creation', (done) => {
    const order = { ...MockOrdersData.orders[0], seat: 1 };
    ordersService.makeOrder.mockReturnValue(of(order));
    ordersService.getOrders.mockReturnValue(of([order]));
    actions$ = of(
      ordersActions.makeOrder({
        order,
      }),
    );

    effects.makeOrder$.subscribe((result) => {
      expect(result).toEqual(ordersActions.orderSuccess({ orders: [order] }));
      done();
    });
  });

  it('should dispatch orderError on failed order creation', (done) => {
    const order = { ...MockOrdersData.orders[0], seat: 1 };
    const errorResponse = new HttpErrorResponse({ error: 'Create Error' });
    ordersService.makeOrder.mockReturnValue(throwError(() => errorResponse));
    actions$ = of(
      ordersActions.makeOrder({
        order,
      }),
    );

    effects.makeOrder$.subscribe((result) => {
      expect(result).toEqual(
        ordersActions.orderError({ error: errorResponse }),
      );
      done();
    });
  });

  it('should dispatch cancelOrderSuccess on successful order cancelation', (done) => {
    ordersService.deleteOrder.mockReturnValue(of(undefined));
    actions$ = of(ordersActions.cancelOrder({ id: 1 }));

    effects.cancelOrder$.subscribe((result) => {
      expect(result).toEqual(ordersActions.cancelOrderSuccess({ id: 1 }));
      done();
    });
  });

  it('should dispatch cancelOrderError on failed order cancelation', (done) => {
    const errorResponse = new HttpErrorResponse({ error: 'Delete Error' });
    ordersService.deleteOrder.mockReturnValue(throwError(() => errorResponse));
    actions$ = of(ordersActions.cancelOrder({ id: 1 }));

    effects.cancelOrder$.subscribe((result) => {
      expect(result).toEqual(
        ordersActions.cancelOrderError({ error: errorResponse }),
      );
      done();
    });
  });
});
