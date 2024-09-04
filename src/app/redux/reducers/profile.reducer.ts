import { createFeature, createReducer, on } from '@ngrx/store';
import { ProfileModel } from '@/core/models/profile.model';
import { ApiError } from '@/core/models/api.model';
import UserStorage from '@/features/auth/utils/userStorage';
import { profileActions } from '../actions';

type ProfileState = {
  profile: ProfileModel;
  error: ApiError | Error | null;
  status: 'loading' | 'error' | 'success' | 'not-loaded' | null;
};

const initialState: ProfileState = {
  profile: UserStorage.getUser() ?? { role: 'guest', email: '', name: '' },
  error: null,
  status: 'loading',
};

const profileReducer = createReducer(
  initialState,
  // Load Profile
  on(
    profileActions.loadProfile,
    (state): ProfileState => ({ ...state, status: 'loading' }),
  ),
  on(
    profileActions.loadProfileSuccess,
    (state, { profile }): ProfileState => ({
      status: 'success',
      error: null,
      profile,
    }),
  ),
  on(
    profileActions.loadProfileError,
    (state, { error }): ProfileState => ({
      ...state,
      status: 'not-loaded',
      error: error?.error,
    }),
  ),
  // Update Profile
  on(
    profileActions.updateProfile,
    (state): ProfileState => ({
      ...state,
      status: 'loading',
    }),
  ),
  on(
    profileActions.updateProfileSuccess,
    (state, { profile }): ProfileState => ({
      status: 'success',
      error: null,
      profile,
    }),
  ),
  on(
    profileActions.updateProfileError,
    (state, { error }): ProfileState => ({
      ...state,
      status: 'error',
      error: error?.error,
    }),
  ),
  // Update Password
  on(
    profileActions.updatePassword,
    (state): ProfileState => ({
      ...state,
      status: 'loading',
    }),
  ),
  on(
    profileActions.updatePasswordSuccess,
    (state): ProfileState => ({
      ...state,
      status: 'success',
      error: null,
    }),
  ),
  on(
    profileActions.updatePasswordError,
    (state, { error }): ProfileState => ({
      ...state,
      status: 'error',
      error: error?.error,
    }),
  ),
  // Logout
  on(
    profileActions.logout,
    (state): ProfileState => ({
      ...state,
      status: 'loading',
    }),
  ),
  on(
    profileActions.logoutError,
    (state, { error }): ProfileState => ({
      ...state,
      status: 'error',
      error: error?.error,
    }),
  ),
  on(
    profileActions.logoutSuccess,
    (): ProfileState => ({
      status: 'success',
      error: null,
      profile: { role: 'guest', email: '', name: '' },
    }),
  ),
);

export const profileFeature = createFeature({
  name: 'profile',
  reducer: profileReducer,
});
