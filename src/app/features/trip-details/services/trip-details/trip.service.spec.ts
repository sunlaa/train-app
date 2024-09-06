import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { TripDetailsService } from './trip.service';

describe('TripService', () => {
  let service: TripDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TripDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
