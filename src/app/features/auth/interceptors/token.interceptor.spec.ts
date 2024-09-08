import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { tokenInterceptor } from './token.interceptor';

describe('TokenInterceptor', () => {
  let httpTesting: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([tokenInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: { userToken: 'Token' } },
      ],
    });
    httpTesting = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should add token to the header', () => {
    const url = '/mock';
    httpClient.get(url).subscribe();

    const req = httpTesting.expectOne(url);
    expect(req.request.headers.get('Authorization')).toEqual('Bearer Token');
  });

  it('should not add token to the header if no token present', () => {
    // Reconfigure the module with no token
    TestBed.resetTestingModule(); // Reset the module configuration
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([tokenInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: { userToken: undefined } },
      ],
    });

    httpTesting = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);

    const url = '/mock';
    httpClient.get(url).subscribe();

    const req = httpTesting.expectOne(url);
    expect(req.request.headers.get('Authorization')).toBeNull();
  });
});
