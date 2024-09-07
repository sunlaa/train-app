import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { MockCarriagesData } from '@/testing/mocks/carriages';
import { CarriagesService } from './carriages.service';

describe('CarriagesService', () => {
  const baseURL = '/api/carriage';
  let service: CarriagesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CarriagesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch carriages (getCarriages)', (done) => {
    const mockCarriages = MockCarriagesData.carriages;

    service.getCarriages().subscribe((stations) => {
      expect(stations).toEqual(mockCarriages);
      done();
    });

    const req = httpTestingController.expectOne(baseURL);
    expect(req.request.method).toBe('GET');
    req.flush(mockCarriages);
  });

  it('should create a carriage (createCarriage)', (done) => {
    const newCarriage = MockCarriagesData.carriages[0];

    service.createCarriage(newCarriage).subscribe((response) => {
      expect(response).toEqual(newCarriage);
      done();
    });

    const req = httpTestingController.expectOne(baseURL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newCarriage);
    req.flush(newCarriage);
  });

  it('should update a carriage (updateCarriage)', (done) => {
    const editCarriage = MockCarriagesData.carriages[0];
    const { code, ...requestBody } = editCarriage;

    service.updateCarriage(editCarriage).subscribe((response) => {
      expect(response).toEqual(editCarriage);
      done();
    });

    const req = httpTestingController.expectOne(`${baseURL}/${code}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(requestBody);
    req.flush(editCarriage);
  });

  it('should delete a carriage (deleteCarriage)', (done) => {
    const carriageCode = 'A';

    service.deleteCarriage(carriageCode).subscribe((response) => {
      expect(response).toBeNull();
      done();
    });

    const req = httpTestingController.expectOne(`${baseURL}/${carriageCode}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
