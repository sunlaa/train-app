import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { MockRidesData } from '@/testing/mocks/rides';
import { RidesService } from './rides.service';

describe('RidesService', () => {
  const baseURL = '/api/route';
  let service: RidesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(RidesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch route rides (getRouteRides)', (done) => {
    const mockRouteRides = MockRidesData.routeRides;
    const routeId = mockRouteRides.id;

    service.getRouteRides(routeId).subscribe((routes) => {
      expect(routes).toEqual(mockRouteRides);
      done();
    });

    const req = httpTestingController.expectOne(`${baseURL}/${routeId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRouteRides);
  });

  it('should create a ride (createRide)', (done) => {
    const { id: routeId } = MockRidesData.routeRides;
    const { id, ...newRide } = MockRidesData.rides[0];

    service.createRide(routeId, newRide).subscribe((response) => {
      expect(response).toEqual(newRide);
      done();
    });

    const req = httpTestingController.expectOne(`${baseURL}/${routeId}/ride`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newRide);
    req.flush(newRide);
  });

  it('should update a ride (updateRide)', (done) => {
    const { id: routeId } = MockRidesData.routeRides;
    const editRide = MockRidesData.rides[0];
    const { id, ...requestBody } = editRide;

    service.updateRide(routeId, editRide).subscribe((response) => {
      expect(response).toEqual(editRide);
      done();
    });

    const req = httpTestingController.expectOne(
      `${baseURL}/${routeId}/ride/${editRide.id}`,
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(requestBody);
    req.flush(editRide);
  });

  it('should delete a ride (deleteRide)', (done) => {
    const { id: routeId } = MockRidesData.routeRides;
    const { id: rideId } = MockRidesData.rides[0];

    service.deleteRide(routeId, rideId).subscribe((response) => {
      expect(response).toBeNull();
      done();
    });

    const req = httpTestingController.expectOne(
      `${baseURL}/${routeId}/ride/${rideId}`,
    );
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
