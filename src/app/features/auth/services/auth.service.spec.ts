import { TestBed } from '@angular/core/testing';
import { HttpStatusCode, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { SearchFacadeService } from '@/features/search-tickets/services/search-facade/search-facade.service';
import { ProfileFacadeService } from '@/features/profile/services/profile-facade.service';
import { MockProfileFacade, MockSearchFacade } from '@/testing/mocks';

import { AuthService } from './auth.service';
import UserStorage from '../utils/userStorage';

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;
  let profileFacade: ProfileFacadeService;
  let searchFacade: SearchFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ProfileFacadeService, useClass: MockProfileFacade },
        UserStorage,
        { provide: SearchFacadeService, useClass: MockSearchFacade },
      ],
    });

    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);

    profileFacade = TestBed.inject(ProfileFacadeService);
    searchFacade = TestBed.inject(SearchFacadeService);
  });

  afterEach(() => {
    // Verify that none of the tests make any extra HTTP requests.
    TestBed.inject(HttpTestingController).verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('signup', () => {
    it('should return null, when the http request is successful', async () => {
      const response$ = service.signup({
        email: 'test@com',
        password: 'test',
      });

      const result = firstValueFrom(response$);

      const req = httpTesting.expectOne('/api/signup');

      expect(req.request.method).toBe('POST');

      req.flush({});

      expect(await result).toBeNull();
    });

    it('should return apiError: true, when http error occurs', async () => {
      const response$ = service.signup({
        email: 'test@com',
        password: 'test',
      });

      const result = firstValueFrom(response$);

      const req = httpTesting.expectOne('/api/signup');

      expect(req.request.method).toBe('POST');

      req.flush(
        {},
        { status: HttpStatusCode.BadRequest, statusText: 'Bad Request' },
      );

      expect(await result).toEqual({ apiError: true });
    });
  });

  describe('signin', () => {
    it('should successfully sign in a user and set token', async () => {
      const token = 'fakeToken';
      jest.spyOn(UserStorage, 'setAuthToken');
      jest.spyOn(profileFacade, 'loadProfile');

      const response$ = service.signin({
        email: 'test@com',
        password: 'test',
      });

      const result = firstValueFrom(response$);

      const req = httpTesting.expectOne('/api/signin');

      expect(req.request.method).toBe('POST');

      req.flush({ token });

      expect(await result).toBeNull();
      expect(UserStorage.setAuthToken).toHaveBeenCalledWith(token);
      expect(profileFacade.loadProfile).toHaveBeenCalled();
    });
    it('should handle bad request error during signin', async () => {
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

  describe('logout', () => {
    it('should clear user data on logout', () => {
      jest.spyOn(UserStorage, 'clear');
      jest.spyOn(searchFacade, 'resetResults');

      service.logout();

      expect(UserStorage.clear).toHaveBeenCalled();
      expect(searchFacade.resetResults).toHaveBeenCalled();
    });
  });
});
