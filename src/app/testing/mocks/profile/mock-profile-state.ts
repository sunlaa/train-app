import { ProfileModel } from '@/core/models/profile.model';
import { ProfileState } from '@/redux/reducers';

export const mockProfile: ProfileModel = {
  role: 'manager',
  name: 'Test',
  email: 'test@example.com',
};

export class MockProfileState {
  static successState: ProfileState = {
    profile: mockProfile,
    status: 'success',
    error: null,
  };

  static loadingState: ProfileState = {
    profile: mockProfile,
    status: 'loading',
    error: null,
  };

  static errorState: ProfileState = {
    profile: mockProfile,
    status: 'error',
    error: { message: 'Some error', reason: 'someError' },
  };
}
