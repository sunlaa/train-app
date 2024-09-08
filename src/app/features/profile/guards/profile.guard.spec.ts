import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  GuardResult,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '@/features/auth/services/auth.service';
import { MockAuthService } from '@/testing/mocks';

import { profileGuard } from './profile.guard';

describe('profileGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => profileGuard(...guardParameters));

  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;

  let router: Router;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useClass: MockAuthService }],
    });

    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
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

  it('should deny access and navigate to signin page for quests', () => {
    Object.defineProperty(authService, 'userToken', {
      get: () => null,
    });

    const routerSpy = jest.spyOn(router, 'navigate');

    const result = executeGuard(route, state) as GuardResult;

    expect(result).toBeFalsy();
    expect(routerSpy).toHaveBeenCalledWith(['/signin']);
  });
});
