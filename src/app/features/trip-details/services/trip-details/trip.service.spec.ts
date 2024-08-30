import { TestBed } from '@angular/core/testing';

import { TripDetailsService } from './trip.service';

describe('TripService', () => {
  let service: TripDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
