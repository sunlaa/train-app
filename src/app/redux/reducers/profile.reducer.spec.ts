import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '@/core/models/api.model';
import { ProfileModel } from '@/core/models/profile.model';
import { profileActions } from '../actions';
import { ProfileState, profileFeature } from './profile.reducer';

describe('ProfileReducer', () => {
  let initialState: ProfileState;
  const genericApiError: ApiError = {
    message: 'Error with profile',
    reason: 'profileError',
  };

  beforeEach(() => {
    initialState = {
      profile: { role: 'guest', email: '', name: '' },
      error: null,
      status: 'loading',
    };
  });

  // Load profile actions

  it('should set loading status when load action is dispatched', () => {
    const action = profileActions.loadProfile();
    const newState = profileFeature.reducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      status: 'loading',
    });
  });

  it('should update profile and set success status when loadProfileSuccess action is dispatched', () => {
    const profile: ProfileModel = {
      role: 'user',
      email: 'testmail@gmail.com',
      name: 'Test',
    };

    const state = profileFeature.reducer(
      initialState,
      profileActions.loadProfileSuccess({
        profile,
      }),
    );

    expect(state).toEqual({
      profile,
      error: null,
      status: 'success',
    });
  });

  it('should set error and status when loadProfileError action is dispatched', () => {
    const error = new HttpErrorResponse({ error: genericApiError });

    const state = profileFeature.reducer(
      initialState,
      profileActions.loadProfileError({ error }),
    );

    expect(state).toEqual({
      ...initialState,
      error: genericApiError,
      status: 'not-loaded',
    });
  });

  // Update profile actions

  it('should set loading status when updateProfile action is dispatched', () => {
    const profile: ProfileModel = {
      role: 'user',
      email: 'testmail@gmail.com',
      name: 'Test',
    };

    const state = profileFeature.reducer(
      initialState,
      profileActions.updateProfile({
        profile,
      }),
    );

    expect(state).toEqual({
      ...initialState,
      status: 'loading',
    });
  });

  it('should update a profile when updateProfileSuccess action is dispatched', () => {
    const profile: ProfileModel = {
      role: 'user',
      email: 'testmail@gmail.com',
      name: 'Test',
    };
    const previousState: ProfileState = {
      ...initialState,
      profile,
    };

    const updatedProfile: ProfileModel = {
      role: 'user',
      email: 'testmail22@gmail.com',
      name: 'Test1',
    };

    const state = profileFeature.reducer(
      previousState,
      profileActions.updateProfileSuccess({ profile: updatedProfile }),
    );

    expect(state).toEqual({
      profile: updatedProfile,
      error: null,
      status: 'success',
    });
  });

  it('should set error and status when updateProfileError action is dispatched', () => {
    const error = new HttpErrorResponse({ error: genericApiError });

    const state = profileFeature.reducer(
      initialState,
      profileActions.updateProfileError({ error }),
    );

    expect(state).toEqual({
      ...initialState,
      error: genericApiError,
      status: 'error',
    });
  });

  // Update password actions

  it('should set loading status when updatePassword action is dispatched', () => {
    const state = profileFeature.reducer(
      initialState,
      profileActions.updatePassword({
        password: 'pass',
      }),
    );

    expect(state).toEqual({
      ...initialState,
      status: 'loading',
    });
  });

  it('should update status when updatePasswordSuccess action is dispatched', () => {
    const state = profileFeature.reducer(
      initialState,
      profileActions.updatePasswordSuccess(),
    );

    expect(state).toEqual({
      ...initialState,
      error: null,
      status: 'success',
    });
  });

  it('should set error and status when updatePasswordError action is dispatched', () => {
    const error = new HttpErrorResponse({ error: genericApiError });

    const state = profileFeature.reducer(
      initialState,
      profileActions.updatePasswordError({ error }),
    );

    expect(state).toEqual({
      ...initialState,
      error: genericApiError,
      status: 'error',
    });
  });

  // Logout actions

  it('should set loading status when logout action is dispatched', () => {
    const state = profileFeature.reducer(initialState, profileActions.logout());

    expect(state).toEqual({
      ...initialState,
      status: 'loading',
    });
  });

  it('should set guest profile when logoutSuccess action is dispatched', () => {
    const profile: ProfileModel = {
      role: 'user',
      email: 'testmail@gmail.com',
      name: 'Test',
    };
    const previousState: ProfileState = {
      ...initialState,
      profile,
    };

    const state = profileFeature.reducer(
      previousState,
      profileActions.logoutSuccess(),
    );

    expect(state).toEqual({
      ...previousState,
      profile: initialState.profile,
      error: null,
      status: 'success',
    });
  });

  it('should set error and status when logoutError action is dispatched', () => {
    const error = new HttpErrorResponse({ error: genericApiError });

    const state = profileFeature.reducer(
      initialState,
      profileActions.logoutError({ error }),
    );

    expect(state).toEqual({
      ...initialState,
      error: genericApiError,
      status: 'error',
    });
  });
});
