import { ProfileModel } from '@/core/models/profile.model';
import { of } from 'rxjs';

export default class MockProfileFacade {
  profile$ = of({ role: 'guest', name: '', email: '' });

  status$ = of(null);

  loadProfile() {}

  updateProfile(profile: Omit<ProfileModel, 'role'>) {
    return profile;
  }

  public updatePassword(password: string) {
    return password;
  }

  public logout() {}
}
