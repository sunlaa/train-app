import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { MockStationsData } from '@/testing/mocks';
import { StationsService } from './stations.service';

describe('StationsService', () => {
  const baseURL = '/api/station';
  let service: StationsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(StationsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch stations (getStations)', () => {
    const mockStations = MockStationsData.listedStations;

    service.getStations().subscribe((stations) => {
      expect(stations).toEqual(mockStations);
    });

    const req = httpTestingController.expectOne(baseURL);
    expect(req.request.method).toBe('GET');
    req.flush(mockStations);
  });

  it('should create a station (createStation)', () => {
    const newStation = MockStationsData.creationStations[0];

    service.createStation(newStation).subscribe((response) => {
      expect(response).toEqual(newStation);
    });

    const req = httpTestingController.expectOne(baseURL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newStation);
    req.flush(newStation);
  });

  it('should delete a station (deleteStation)', () => {
    const stationId = 1;

    service.deleteStation(stationId).subscribe((response) => {
      expect(response).toBeUndefined();
    });

    const req = httpTestingController.expectOne(`${baseURL}/${stationId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
