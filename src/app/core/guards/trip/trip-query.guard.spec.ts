import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { tripQueryGuard } from './trip-query.guard';

describe('tripQueryGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => tripQueryGuard(...guardParameters));

  let router: Router;
  let navigateSpy: jest.SpyInstance;

  const state = {} as RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    router = TestBed.inject(Router);
    navigateSpy = jest.spyOn(router, 'navigate');
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow activation if "from" and "to" query params are present', () => {
    const mockRoute = {
      queryParamMap: new Map([
        ['from', 'CityA'],
        ['to', 'CityB'],
      ]),
    } as unknown as ActivatedRouteSnapshot;

    const result = executeGuard(mockRoute, state);

    expect(result).toBe(true);
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should navigate to 404 if "from" and "to" query params are missing', () => {
    const mockRoute = {
      queryParamMap: new Map([]),
    } as unknown as ActivatedRouteSnapshot;

    const result = executeGuard(mockRoute, state);

    expect(result).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['**'], {
      skipLocationChange: true,
    });
  });
});
