import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { ProfileService } from '@/features/profile/services/profile.service';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import UserStorage from '@/features/auth/utils/userStorage';
import { mockProfile, mockUpdateData } from '@/testing/mocks';
import { firstValueFrom, of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { profileActions } from '../actions';

import { ProfileEffects } from './profile.effects';
import { profileFeature } from '../reducers';

describe('StationsEffects', () => {
  let effects: ProfileEffects;
  let actions$: Actions<Action<string>>;
  let store: MockStore;
  let profileService: jest.Mocked<ProfileService>;
  let userStorageSpy: jest.SpyInstance;

  beforeEach(() => {
    const profileServiceMock = {
      loadProfile: jest.fn(),
      updateProfile: jest.fn(),
      updatePassword: jest.fn(),
      logout: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ProfileEffects,
        provideMockActions(() => actions$),
        provideMockStore({}),
        { provide: ProfileService, useValue: profileServiceMock },
      ],
    });

    effects = TestBed.inject(ProfileEffects);
    store = TestBed.inject(MockStore);
    profileService = TestBed.inject(
      ProfileService,
    ) as jest.Mocked<ProfileService>;

    userStorageSpy = jest
      .spyOn(UserStorage, 'setUser')
      .mockImplementation(() => {});

    store.overrideSelector(profileFeature.selectProfile, mockProfile);
  });

  it('should dispatch loadProfileSuccess on successful loadProfile', async () => {
    profileService.loadProfile.mockReturnValue(of(mockProfile));

    actions$ = of(profileActions.loadProfile());

    const result = firstValueFrom(effects.loadProfile$);

    expect(await result).toEqual(
      profileActions.loadProfileSuccess({ profile: mockProfile }),
    );
  });

  it('should dispatch loadProfileError on failed loadProfile', async () => {
    const errorResponse = new HttpErrorResponse({ error: 'Error' });
    profileService.loadProfile.mockReturnValue(throwError(() => errorResponse));
    actions$ = of(profileActions.loadProfile());

    const result = firstValueFrom(effects.loadProfile$);

    expect(await result).toEqual(
      profileActions.loadProfileError({ error: errorResponse }),
    );
  });

  it('should dispatch updateProfileSuccess on successful updateProfile', async () => {
    profileService.updateProfile.mockReturnValue(of(mockProfile));

    actions$ = of(profileActions.updateProfile({ profile: mockUpdateData }));

    const result = firstValueFrom(effects.updateProfile$);

    expect(await result).toEqual(
      profileActions.updateProfileSuccess({ profile: mockProfile }),
    );
  });

  it('should dispatch updateProfileError on failed updateProfile', async () => {
    const errorResponse = new HttpErrorResponse({ error: 'Error' });
    profileService.updateProfile.mockReturnValue(
      throwError(() => errorResponse),
    );
    actions$ = of(profileActions.updateProfile({ profile: mockUpdateData }));

    const result = firstValueFrom(effects.updateProfile$);

    expect(await result).toEqual(
      profileActions.updateProfileError({ error: errorResponse }),
    );
  });

  it('should dispatch updatePasswordSuccess on successful updatePassword', async () => {
    profileService.updatePassword.mockReturnValue(of(undefined));

    actions$ = of(profileActions.updatePassword({ password: 'newPassword' }));

    const result = firstValueFrom(effects.updatePassword$);

    expect(await result).toEqual(profileActions.updatePasswordSuccess());
  });

  it('should dispatch updatePasswordError on failed updatePassword', async () => {
    const errorResponse = new HttpErrorResponse({ error: 'Error' });
    profileService.updatePassword.mockReturnValue(
      throwError(() => errorResponse),
    );
    actions$ = of(profileActions.updatePassword({ password: 'newPassword' }));

    const result = firstValueFrom(effects.updatePassword$);

    expect(await result).toEqual(
      profileActions.updatePasswordError({ error: errorResponse }),
    );
  });

  it('should dispatch logoutSuccess on successful logout', async () => {
    profileService.logout.mockReturnValue(of(undefined));

    actions$ = of(profileActions.logout());

    const result = firstValueFrom(effects.logout$);

    expect(await result).toEqual(profileActions.logoutSuccess());
  });

  it('should dispatch logoutError on failed logout', async () => {
    const errorResponse = new HttpErrorResponse({ error: 'Error' });
    profileService.logout.mockReturnValue(throwError(() => errorResponse));
    actions$ = of(profileActions.logout());

    const result = firstValueFrom(effects.logout$);

    expect(await result).toEqual(
      profileActions.logoutError({ error: errorResponse }),
    );
  });

  test.each([
    {
      action: profileActions.loadProfileSuccess({ profile: mockProfile }),
      description: 'loadProfileSuccess',
    },
    {
      action: profileActions.updateProfileSuccess({ profile: mockProfile }),
      description: 'updateProfileSuccess',
    },
    {
      action: profileActions.logoutSuccess(),
      description: 'logoutSuccess',
    },
  ])('should call UserStorage.setUser on $description', async ({ action }) => {
    actions$ = of(action);

    await firstValueFrom(effects.updateStorage$);

    expect(userStorageSpy).toHaveBeenCalledWith(mockProfile);
  });
});
