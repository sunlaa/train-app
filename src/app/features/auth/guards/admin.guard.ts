import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ProfileFacadeService } from '@/features/profile/services/profile-facade.service';
import { map, Observable, take } from 'rxjs';

export const adminGuard: CanActivateFn = (): Observable<boolean> => {
  const profileFacade = inject(ProfileFacadeService);
  const router = inject(Router);

  return profileFacade.profile$.pipe(
    take(1),
    map(({ role }) => {
      if (role !== 'manager') {
        router.navigate(['/unauthorized'], { skipLocationChange: true });
        return false;
      }
      return true;
    }),
  );
};
