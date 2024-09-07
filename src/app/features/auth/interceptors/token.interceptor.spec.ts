import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { MockAuthService } from '@/testing/mocks';
import {
  HTTP_INTERCEPTORS,
  HttpInterceptorFn,
  provideHttpClient,
} from '@angular/common/http';
import { AuthService } from '../services/auth.service';

import { tokenInterceptor } from './token.interceptor';

describe('tokenInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => tokenInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: MockAuthService },
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: HTTP_INTERCEPTORS,
          useValue: tokenInterceptor,
          multi: true,
        },
      ],
    });
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
