import { TestBed } from '@angular/core/testing';
import { mockRideResponse, handledMockResponse } from '@/testing/mocks/trip';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { mockCarriageMap, mockStationMap } from '@/testing/mocks';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { TripDetailsService } from './trip.service';

describe('TripService', () => {
  let service: TripDetailsService;
  let httpTesting: HttpTestingController;
  let router: Router;

  const baseURL = '/api/search';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TripDetailsService);

    httpTesting = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get ride and handle response (getRideDetails)', async () => {
    const response$ = service.getRideDetails(
      1,
      2,
      5,
      mockCarriageMap,
      mockStationMap,
    );

    const result = firstValueFrom(response$);

    const req = httpTesting.expectOne(`${baseURL}/1`);

    expect(req.request.method).toBe('GET');
    req.flush(mockRideResponse);

    expect(await result).toEqual(handledMockResponse);
  });

  it('should return {} and navigate to 404 if handling error (getRideDetails)', async () => {
    // @ts-expect-error to test private method
    jest.spyOn(service, 'handleRideData').mockImplementation(() => {
      throw Error();
    });

    jest.spyOn(router, 'navigate');

    const response$ = service.getRideDetails(
      1,
      2,
      5,
      mockCarriageMap,
      mockStationMap,
    );

    const result = firstValueFrom(response$);

    const req = httpTesting.expectOne(`${baseURL}/1`);

    expect(req.request.method).toBe('GET');
    req.flush(mockRideResponse);

    expect(await result).toEqual({});

    expect(router.navigate).toHaveBeenCalledWith(['**'], {
      skipLocationChange: true,
    });
  });

  it('should handle ride data (handleRideData)', () => {
    // @ts-expect-error to test private method
    const result = service.handleRideData(
      mockRideResponse,
      2,
      5,
      mockCarriageMap,
      mockStationMap,
    );

    expect(result).toEqual(handledMockResponse);
  });
});
