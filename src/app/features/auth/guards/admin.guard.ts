import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ProfileFacadeService } from '@/features/profile/services/profile-facade.service';
import { map, take } from 'rxjs';

export const adminGuard: CanActivateFn = () => {
  const profileFacade = inject(ProfileFacadeService);
  const router = inject(Router);

  return profileFacade.profile$.pipe(
    take(1),
    map(({ role }) => {
      if (role !== 'manager') {
        return router.createUrlTree(['/']);
      }
      return true;
    }),
  );
};
