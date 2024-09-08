import { of } from 'rxjs';

export default class MockProfileFacade {
  profile$ = of({});

  status$ = of(null);

  loadProfile() {}

  updateProfile() {}

  updatePassword() {}

  logout() {}
}
