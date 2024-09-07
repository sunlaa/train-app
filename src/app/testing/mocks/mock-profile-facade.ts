import { ProfileModel } from '@/core/models/profile.model';
import { of } from 'rxjs';

export default class MockProfileFacade {
  profile$ = of({});

  status$ = of(null);

  loadProfile() {}

  updateProfile(profile: Omit<ProfileModel, 'role'>) {
    return profile;
  }

  updatePassword(password: string) {
    return password;
  }

  logout() {}
}
