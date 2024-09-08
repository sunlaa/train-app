import { TestBed } from '@angular/core/testing';
import { MockAuthService } from '@/testing/mocks';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  GuardResult,
  provideRouter,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

import { notGuestGuard } from './not-guest.guard';

describe('notGuestGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => notGuestGuard(...guardParameters));

  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;

  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useClass: MockAuthService },
      ],
    });

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it("should allow access and don't navigate for non quests", () => {
    Object.defineProperty(authService, 'userToken', {
      get: () => 'token',
    });
    const routerSpy = jest.spyOn(router, 'navigate');

    const result = executeGuard(route, state) as GuardResult;

    expect(result).toBeTruthy();
    expect(routerSpy).not.toHaveBeenCalled();
  });

  it('should deny access and navigate for quests', () => {
    Object.defineProperty(authService, 'userToken', {
      get: () => null,
    });

    const routerSpy = jest.spyOn(router, 'navigate');

    const result = executeGuard(route, state) as GuardResult;

    expect(result).toBeFalsy();
    expect(routerSpy).toHaveBeenCalledWith(['/']);
  });
});
