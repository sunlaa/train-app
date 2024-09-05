import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { RidesService } from './rides.service';

describe('RidesService', () => {
  let service: RidesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(RidesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
