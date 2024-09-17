import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { StationsFacadeService } from '@/features/stations-management/services/stations-facade.service';
import { MockCarriagesFacade, MockStationsFacade } from '@/testing/mocks';
import { firstValueFrom } from 'rxjs';
import {
  handledMockResponse,
  mockCarriageMap,
  mockHandledTicketsData,
  mockParams,
  mockSearchResponse,
  mockStationMap,
} from '@/testing/mocks/search/mock-search-data';
import { CarriagesFacadeService } from '@/features/carriages-management/services/carriages-facade.service';

import { SearchService } from './search.service';

describe('SearchService', () => {
  const baseURL = '/api/search';

  let service: SearchService;
  let httpTesting: HttpTestingController;
  let stationsFacade: StationsFacadeService;
  let carriageFacade: CarriagesFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: StationsFacadeService, useClass: MockStationsFacade },
        { provide: CarriagesFacadeService, useClass: MockCarriagesFacade },
      ],
    });
    service = TestBed.inject(SearchService);
    httpTesting = TestBed.inject(HttpTestingController);
    stationsFacade = TestBed.inject(StationsFacadeService);
    carriageFacade = TestBed.inject(CarriagesFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should search and handle response (search)', async () => {
    stationsFacade.stationMap = signal(mockStationMap);
    carriageFacade.carriageMap = signal(mockCarriageMap);

    const response$ = service.search(mockParams);

    const result = firstValueFrom(response$);

    const req = httpTesting.expectOne(
      `${baseURL}?fromLatitude=${mockParams.fromLatitude}&fromLongitude=${mockParams.fromLongitude}&toLatitude=${mockParams.toLatitude}&toLongitude=${mockParams.toLongitude}&time=${mockParams.time}`,
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockSearchResponse);

    expect(await result).toEqual(handledMockResponse);
  });

  it('should return valid tickets data (getTicketsData)', () => {
    stationsFacade.stationMap = signal(mockStationMap);
    carriageFacade.carriageMap = signal(mockCarriageMap);

    // @ts-expect-error to test private method
    const result = service.getTicketsData(mockSearchResponse);

    expect(result).toEqual(mockHandledTicketsData);
  });

  it('should throw an error if no stationsMap (getTicketsData)', async () => {
    stationsFacade.stationMap = signal(undefined);
    carriageFacade.carriageMap = signal(mockCarriageMap);

    expect(() => {
      // @ts-expect-error to test private method
      service.getTicketsData(mockSearchResponse);
    }).toThrow('No station map in store.');
  });

  it('should throw an error if no carriageMap (getTicketsData)', async () => {
    stationsFacade.stationMap = signal(mockStationMap);
    carriageFacade.carriageMap = signal(undefined);

    expect(() => {
      // @ts-expect-error to test private method
      service.getTicketsData(mockSearchResponse);
    }).toThrow('No carriage map in store.');
  });

  it('should group tickets by unique departure dates', () => {
    stationsFacade.stationMap = signal(mockStationMap);
    carriageFacade.carriageMap = signal(mockCarriageMap);

    // @ts-expect-error to test private method
    const result = service.getTicketsData(mockSearchResponse);

    expect(result).toEqual(mockHandledTicketsData);
  });

  it('should return an empty array if no tickets are provided', () => {
    // @ts-expect-error to test private method
    const result = service.filterTicketsByDate([]);
    expect(result).toEqual([]);
  });
});
