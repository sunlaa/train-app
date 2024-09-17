import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { MockOrdersData } from '@/testing/mocks';
import { UsersService } from './users.service';

describe('UsersService', () => {
  const baseURL = '/api/users';
  let service: UsersService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UsersService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch users (getUsers)', (done) => {
    const mockUsers = MockOrdersData.users;

    service.getUsers().subscribe((users) => {
      expect(users).toEqual(mockUsers);
      done();
    });

    const req = httpTestingController.expectOne(baseURL);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
});
