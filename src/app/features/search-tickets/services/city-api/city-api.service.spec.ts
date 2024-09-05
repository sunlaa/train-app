import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { CityApiService } from './city-api.service';

describe('CityApiService', () => {
  let service: CityApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CityApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
