import { TestBed } from '@angular/core/testing';

import { CarriagesFacadeService } from './carriages-facade.service';

describe('CarriagesFacadeService', () => {
  let service: CarriagesFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarriagesFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
