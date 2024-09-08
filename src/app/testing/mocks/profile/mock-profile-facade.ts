import { of } from 'rxjs';

export class MockProfileFacade {
  profile$ = of({});

  status$ = of(null);

  loadProfile() {}

  updateProfile() {}

  updatePassword() {}

  logout() {}
}
