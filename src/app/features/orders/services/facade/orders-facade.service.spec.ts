import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ordersFeature } from '@/redux/reducers/orders.reducer';
import { MockOrdersData, MockOrdersState } from '@/testing/mocks';
import { ordersActions } from '@/redux/actions/orders.actions';
import { OrdersFacadeService } from './orders-facade.service';

describe('OrdersFacadeService', () => {
  let service: OrdersFacadeService;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;

  const mockOrdersState = MockOrdersState.successState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({})],
    });
    service = TestBed.inject(OrdersFacadeService);
    store = TestBed.inject(MockStore);

    dispatchSpy = jest.spyOn(store, 'dispatch');
    store.overrideSelector(ordersFeature.selectOrdersState, mockOrdersState);
    store.overrideSelector(ordersFeature.selectOrders, mockOrdersState.orders);
    store.overrideSelector(ordersFeature.selectStatus, mockOrdersState.status);
    store.overrideSelector(ordersFeature.selectError, mockOrdersState.error);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should dispatch load action on load()', () => {
    service.load(false);
    expect(dispatchSpy).toHaveBeenCalledWith(
      ordersActions.load({ all: false }),
    );
  });

  it('should dispatch makeOrder action on makeOrder()', () => {
    const order = { ...MockOrdersData.orders[0], seat: 1 };

    service.makeOrder(order);

    expect(dispatchSpy).toHaveBeenCalledWith(
      ordersActions.makeOrder({ order }),
    );
  });

  it('should dispatch cancelOrder action on cancelOrder()', () => {
    service.cancelOrder(1);

    expect(dispatchSpy).toHaveBeenCalledWith(
      ordersActions.cancelOrder({ id: 1 }),
    );
  });

  it('should return state$ observable from store', (done) => {
    service.state$.subscribe((state) => {
      expect(state).toEqual(mockOrdersState);
      done();
    });
  });

  it('should return orders$ observable from store', (done) => {
    service.orders$.subscribe((orders) => {
      expect(orders).toEqual(mockOrdersState.orders);
      done();
    });
  });

  it('should return status$ observable from store', (done) => {
    service.status$.subscribe((status) => {
      expect(status).toEqual(mockOrdersState.status);
      done();
    });
  });

  it('should return error$ observable from store', (done) => {
    service.error$.subscribe((error) => {
      expect(error).toEqual(mockOrdersState.error);
      done();
    });
  });
});
