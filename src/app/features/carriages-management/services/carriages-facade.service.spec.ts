import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { CarriagesFacadeService } from './carriages-facade.service';

describe('CarriagesFacadeService', () => {
  let service: CarriagesFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: provideMockStore({}) });
    service = TestBed.inject(CarriagesFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
