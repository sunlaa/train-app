import { ProfileModel } from '@/core/models/profile.model';
import { profileActions } from '@/redux/actions';
import { profileFeature } from '@/redux/reducers/profile.reducer';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map, Observable, take } from 'rxjs';

type ActionResult = {
  isSuccess: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class ProfileFacadeService {
  private store = inject(Store);

  get profile$(): Observable<ProfileModel> {
    return this.store.select(profileFeature.selectProfile);
  }

  get status$(): Observable<
    'loading' | 'error' | 'success' | 'not-loaded' | null
  > {
    return this.store.select(profileFeature.selectStatus);
  }

  public loadProfile(): void {
    this.store.dispatch(profileActions.loadProfile());
  }

  public updateProfile(
    profile: Omit<ProfileModel, 'role'>,
  ): Observable<ActionResult> {
    this.store.dispatch(profileActions.updateProfile({ profile }));
    return this.status$.pipe(
      filter((status) => status !== 'loading'),
      map((status) => ({ isSuccess: status === 'success' })),
      take(1),
    );
  }

  public updatePassword(password: string): Observable<ActionResult> {
    this.store.dispatch(profileActions.updatePassword({ password }));
    return this.status$.pipe(
      filter((status) => status !== 'loading'),
      map((status) => ({ isSuccess: status === 'success' })),
      take(1),
    );
  }

  public logout(): Observable<ActionResult> {
    this.store.dispatch(profileActions.logout());
    return this.status$.pipe(
      filter((status) => status !== 'loading'),
      map((status) => ({ isSuccess: status === 'success' })),
      take(1),
    );
  }
}
