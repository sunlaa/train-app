import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const tripQueryGuard: CanActivateFn = (route) => {
  const queryParams = route.queryParamMap;
  const router = inject(Router);

  if (queryParams.has('from') && queryParams.has('to')) {
    return true;
  }
  router.navigate(['**'], { skipLocationChange: true });
  return false;
};
