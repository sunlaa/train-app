import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { mockProfile, mockUpdateData } from '@/testing/mocks';
import { firstValueFrom } from 'rxjs';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  const baseURL = '/api/profile';

  let service: ProfileService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProfileService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load profile (loadProfile)', async () => {
    const response$ = service.loadProfile();

    const result = firstValueFrom(response$);

    const req = httpTesting.expectOne(baseURL);

    expect(req.request.method).toBe('GET');
    req.flush(mockProfile);

    expect(await result).toEqual(mockProfile);
  });

  it('should update profile (updateProfile)', async () => {
    const response$ = service.updateProfile(mockUpdateData);

    const result = firstValueFrom(response$);

    const req = httpTesting.expectOne(baseURL);

    expect(req.request.method).toBe('PUT');
    req.flush(mockProfile);

    expect(await result).toEqual(mockProfile);
  });

  it('should update password (updatePassword)', async () => {
    const response$ = service.updatePassword('newPassword');

    const result = firstValueFrom(response$);

    const req = httpTesting.expectOne(`${baseURL}/password`);

    expect(req.request.method).toBe('PUT');
    req.flush(null);

    expect(await result).toEqual(null);
  });

  it('should logout (logout)', async () => {
    const response$ = service.logout();

    const result = firstValueFrom(response$);

    const req = httpTesting.expectOne('/api/logout');

    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    expect(await result).toEqual(null);
  });
});
