import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  GuardResult,
  provideRouter,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { firstValueFrom, Observable, of } from 'rxjs';
import { ProfileFacadeService } from '@/features/profile/services/profile-facade.service';
import { MockProfileFacade } from '@/testing/mocks';

import { adminGuard } from './admin.guard';

describe('adminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => adminGuard(...guardParameters));

  let profileFacade: ProfileFacadeService;
  let router: Router;

  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: ProfileFacadeService, useClass: MockProfileFacade },
      ],
    });

    profileFacade = TestBed.inject(ProfileFacadeService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow access for manager role', async () => {
    Object.defineProperty(profileFacade, 'profile$', {
      get: () => of({ role: 'manager' }),
    });

    const result = (await executeGuard(
      route,
      state,
    )) as Observable<GuardResult>;

    const result$ = firstValueFrom(result);

    expect(await result$).toBeTruthy();
  });

  it('should deny access and navigate for non-manager role', async () => {
    Object.defineProperty(profileFacade, 'profile$', {
      get: () => of({ role: 'user' }),
    });

    const routerSpy = jest.spyOn(router, 'navigate');

    const result = (await executeGuard(
      route,
      state,
    )) as Observable<GuardResult>;

    const result$ = firstValueFrom(result);

    expect(await result$).toBeFalsy();
    expect(routerSpy).toHaveBeenCalledWith(['/unauthorized'], {
      skipLocationChange: true,
    });
  });
});
