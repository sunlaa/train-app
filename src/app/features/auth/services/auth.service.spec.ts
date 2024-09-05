import { TestBed } from '@angular/core/testing';
import { HttpStatusCode, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMockStore({}),
      ],
    });
    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify that none of the tests make any extra HTTP requests.
    TestBed.inject(HttpTestingController).verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should return null, when the http request is successful', async () => {
      const response$ = service.signin({
        email: 'test@com',
        password: 'test',
      });

      const result = firstValueFrom(response$);

      const req = httpTesting.expectOne('/api/signin');

      expect(req.request.method).toBe('POST');

      req.flush({});

      expect(await result).toBeNull();
    });

    it('should return apiError: true, when http error occurs', async () => {
      const response$ = service.signin({
        email: 'test@com',
        password: 'test',
      });

      const result = firstValueFrom(response$);

      const req = httpTesting.expectOne('/api/signin');

      expect(req.request.method).toBe('POST');

      req.flush(
        {},
        { status: HttpStatusCode.BadRequest, statusText: 'Bad Request' },
      );

      expect(await result).toEqual({ apiError: true });
    });
  });
});
