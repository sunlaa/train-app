import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { profileFeature } from '@/redux/reducers';
import { mockProfile, MockProfileState, mockUpdateData } from '@/testing/mocks';
import { profileActions } from '@/redux/actions';

import { ProfileFacadeService } from './profile-facade.service';

describe('ProfileFacadeService', () => {
  let service: ProfileFacadeService;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;

  const mockProfileState = MockProfileState.successState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({})],
    });
    service = TestBed.inject(ProfileFacadeService);
    store = TestBed.inject(MockStore);

    dispatchSpy = jest.spyOn(store, 'dispatch');

    store.overrideSelector(profileFeature.selectProfileState, mockProfileState);

    store.overrideSelector(
      profileFeature.selectStatus,
      mockProfileState.status,
    );

    store.overrideSelector(profileFeature.selectProfile, mockProfile);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should dispatch loadProfile action on loadProfile()', () => {
    service.loadProfile();
    expect(dispatchSpy).toHaveBeenCalledWith(profileActions.loadProfile());
  });

  it('should dispatch updateProfile action on updateProfile()', () => {
    service.updateProfile(mockUpdateData).subscribe();

    expect(dispatchSpy).toHaveBeenCalledWith(
      profileActions.updateProfile({ profile: mockUpdateData }),
    );
  });

  it('should dispatch updatePassword action on updatePassword()', () => {
    const password = 'newPassword';

    service.updatePassword(password).subscribe();

    expect(dispatchSpy).toHaveBeenCalledWith(
      profileActions.updatePassword({ password }),
    );
  });

  it('should dispatch logout action on logout()', () => {
    service.logout().subscribe();

    expect(dispatchSpy).toHaveBeenCalledWith(profileActions.logout());
  });

  it('should return state$ observable from store', () => {
    service.state$.subscribe((state) => {
      expect(state).toEqual(mockProfileState);
    });
  });

  it('should return profile$ observable from store', () => {
    service.profile$.subscribe((state) => {
      expect(state).toEqual(mockProfile);
    });
  });

  it('should return status$ observable from store', () => {
    service.status$.subscribe((state) => {
      expect(state).toEqual(mockProfileState.status);
    });
  });
});
