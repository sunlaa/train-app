import { TestBed } from '@angular/core/testing';

import { OrdersFacadeService } from './orders-facade.service';

describe('OrdersFacadeService', () => {
  let service: OrdersFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdersFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
