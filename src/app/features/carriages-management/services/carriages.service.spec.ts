import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { CarriagesService } from './carriages.service';

describe('CarriagesService', () => {
  let service: CarriagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CarriagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
