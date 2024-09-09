import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { MockOrdersData } from '@/testing/mocks';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  const baseURL = '/api/order';
  let service: OrdersService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(OrdersService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch orders (getOrders)', (done) => {
    const mockOrders = MockOrdersData.orders;

    service.getOrders().subscribe((orders) => {
      expect(orders).toEqual(mockOrders);
      done();
    });

    const req = httpTestingController.expectOne(
      (request) =>
        request.url === baseURL && request.params.get('all') === 'false',
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockOrders);
  });

  it('should fetch all orders (getOrders)', (done) => {
    const mockOrders = MockOrdersData.orders;

    service.getOrders(true).subscribe((orders) => {
      expect(orders).toEqual(mockOrders);
      done();
    });

    const req = httpTestingController.expectOne(
      (request) =>
        request.url === baseURL && request.params.get('all') === 'true',
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockOrders);
  });

  it('should create an order (makeOrder)', (done) => {
    const mockOrderBody = { ...MockOrdersData.orders[0], seat: 1 };

    service.makeOrder(mockOrderBody).subscribe((order) => {
      expect(order).toEqual(null);
      done();
    });

    const req = httpTestingController.expectOne(baseURL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockOrderBody);
    req.flush(null);
  });

  it('should delete an order (deleteOrder)', (done) => {
    const orderId = 1;

    service.deleteOrder(orderId).subscribe(() => {
      done();
    });

    const req = httpTestingController.expectOne(`${baseURL}/${orderId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
