import { AuthService } from '@/features/auth/services/auth.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const profileGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.userToken) {
    return true;
  }

  router.navigate(['/signin']);
  return false;
};
