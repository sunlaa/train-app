import { ProfileModel } from '@/core/models/profile.model';
import { HttpErrorResponse } from '@angular/common/http';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const profileActions = createActionGroup({
  source: 'Profile',
  events: {
    'Load Profile': emptyProps(),
    'Load Profile Success': props<{ profile: ProfileModel }>(),
    'Load Profile Error': props<{ error: HttpErrorResponse }>(),

    'Update Profile': props<{ profile: Omit<ProfileModel, 'role'> }>(),
    'Update Profile Success': props<{ profile: ProfileModel }>(),
    'Update Profile Error': props<{ error: HttpErrorResponse }>(),

    'Update Password': props<{ password: string }>(),
    'Update Password Success': emptyProps(),
    'Update Password Error': props<{ error: HttpErrorResponse }>(),

    Logout: emptyProps(),
    'Logout Success': emptyProps(),
    'Logout Error': props<{ error: HttpErrorResponse }>(),
  },
});
