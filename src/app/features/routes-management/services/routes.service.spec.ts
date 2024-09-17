import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { MockRoutesData } from '@/testing/mocks/routes';
import { RoutesService } from './routes.service';

describe('RoutesService', () => {
  const baseURL = '/api/route';
  let service: RoutesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(RoutesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch routes (getRoutes)', (done) => {
    const mockRoutes = MockRoutesData.routes;

    service.getRoutes().subscribe((routes) => {
      expect(routes).toEqual(mockRoutes);
      done();
    });

    const req = httpTestingController.expectOne(baseURL);
    expect(req.request.method).toBe('GET');
    req.flush(mockRoutes);
  });

  it('should create a route (createRoute)', (done) => {
    const newRoute = MockRoutesData.routes[0];

    service.createRoute(newRoute).subscribe((response) => {
      expect(response).toEqual(newRoute);
      done();
    });

    const req = httpTestingController.expectOne(baseURL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newRoute);
    req.flush(newRoute);
  });

  it('should update a route (updateRoute)', (done) => {
    const editRoute = MockRoutesData.routes[0];
    const { id, ...requestBody } = editRoute;

    service.updateRoute(editRoute).subscribe((response) => {
      expect(response).toEqual(editRoute);
      done();
    });

    const req = httpTestingController.expectOne(`${baseURL}/${id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(requestBody);
    req.flush(editRoute);
  });

  it('should delete a route (deleteRoute)', (done) => {
    const routeId = 1;

    service.deleteRoute(routeId).subscribe((response) => {
      expect(response).toBeNull();
      done();
    });

    const req = httpTestingController.expectOne(`${baseURL}/${routeId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
