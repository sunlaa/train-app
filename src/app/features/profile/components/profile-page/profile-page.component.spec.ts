import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';
import {
  MockAuthService,
  MockNotificationService,
  MockProfileFacade,
} from '@/testing/mocks';
import { AuthService } from '@/features/auth/services/auth.service';
import { NotificationService } from '@/shared/services/notification.service';
import { ProfileFacadeService } from '../../services/profile-facade.service';

import { ProfilePageComponent } from './profile-page.component';

describe('ProfilePageComponent', () => {
  let component: ProfilePageComponent;
  let fixture: ComponentFixture<ProfilePageComponent>;
  let profileFacade: ProfileFacadeService;
  let notificationService: NotificationService;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePageComponent],
      providers: [
        { provide: ProfileFacadeService, useClass: MockProfileFacade },
        { provide: NotificationService, useClass: MockNotificationService },
        { provide: AuthService, useClass: MockAuthService },
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePageComponent);
    component = fixture.componentInstance;

    profileFacade = TestBed.inject(ProfileFacadeService);
    notificationService = TestBed.inject(NotificationService);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load profile on init', () => {
    const profile = {
      email: 'test@example.com',
      name: 'Test',
      role: 'user',
    };
    Object.defineProperty(profileFacade, 'profile$', {
      get: () => of(profile),
    });

    component.ngOnInit();
    expect(component.profile).toEqual(profile);
    expect(component.emailControl.value).toEqual('test@example.com');
    expect(component.nameControl.value).toEqual('Test');
  });

  it('should correct validate the email field', () => {
    component.emailControl.setValue('invalid-email');
    expect(component.emailControl.invalid).toBeTruthy();

    component.emailControl.setValue('test@example.com');
    expect(component.emailControl.valid).toBeTruthy();
  });

  it('should correct validate the name field', () => {
    component.nameControl.setValue('');
    expect(component.nameControl.invalid).toBeTruthy();

    component.nameControl.setValue('Name');
    expect(component.nameControl.valid).toBeTruthy();
  });

  it('should update password and show success notification', () => {
    jest
      .spyOn(profileFacade, 'updatePassword')
      .mockReturnValue(of({ isSuccess: true }));
    jest.spyOn(notificationService, 'messageSuccess');

    component.updatePassword();

    expect(notificationService.messageSuccess).toHaveBeenCalledWith(
      'Password has been updated!',
    );
  });

  it('should handle password update error', () => {
    jest
      .spyOn(profileFacade, 'updatePassword')
      .mockReturnValue(of({ isSuccess: false }));
    jest.spyOn(notificationService, 'messageError');

    component.updatePassword();

    expect(notificationService.messageError).toHaveBeenCalledWith(
      'Error occurs during password update',
    );
  });

  it('should logout and navigate to home', () => {
    jest
      .spyOn(profileFacade, 'logout')
      .mockReturnValue(of({ isSuccess: true }));
    jest.spyOn(authService, 'logout');
    jest.spyOn(router, 'navigate');

    component.logout();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle logout error', () => {
    jest
      .spyOn(profileFacade, 'logout')
      .mockReturnValue(of({ isSuccess: false }));
    jest.spyOn(notificationService, 'messageError');

    component.logout();

    expect(notificationService.messageError).toHaveBeenCalledWith(
      'Error occurs during logout',
    );
  });

  it('should successfully update the profile and show a success message', () => {
    jest.spyOn(profileFacade, 'updateProfile').mockReturnValue(
      of({
        profile: { name: 'Test', email: 'test@example.com', role: 'manager' },
        error: null,
        status: 'success',
      }),
    );

    jest.spyOn(notificationService, 'messageSuccess');

    // @ts-expect-error to test private method
    jest.spyOn(component, 'toggleEditEmail');
    // @ts-expect-error to test private method
    jest.spyOn(component, 'toggleEditName');

    component.onSave();

    expect(profileFacade.updateProfile).toHaveBeenCalledWith({
      email: component.emailControl.value,
      name: component.nameControl.value,
    });
    expect(notificationService.messageSuccess).toHaveBeenCalledWith(
      'Profile has been updated!',
    );

    // @ts-expect-error to test private method
    if (component.isEmailEdit) {
      // @ts-expect-error to test private method
      expect(component.toggleEditEmail).toHaveBeenCalled();
    } else {
      // @ts-expect-error to test private method
      expect(component.toggleEditName).toHaveBeenCalled();
    }
  });

  it('should show an error message if the profile update fails', () => {
    const errorMessage = 'Error';

    jest.spyOn(profileFacade, 'updateProfile').mockReturnValue(
      of({
        profile: { name: 'Test', email: 'test@example.com', role: 'manager' },
        error: { message: errorMessage, reason: '' },
        status: 'error',
      }),
    );

    jest.spyOn(notificationService, 'messageError');

    component.onSave();

    expect(profileFacade.updateProfile).toHaveBeenCalledWith({
      email: component.emailControl.value,
      name: component.nameControl.value,
    });
    expect(notificationService.messageError).toHaveBeenCalledWith(errorMessage);
  });

  it('should pass the correct values to updateProfile', () => {
    component.emailControl.setValue('test@example.com');
    component.nameControl.setValue('Test');

    jest.spyOn(profileFacade, 'updateProfile').mockReturnValue(
      of({
        profile: { name: 'Test', email: 'test@example.com', role: 'manager' },
        error: null,
        status: 'success',
      }),
    );

    component.onSave();

    expect(profileFacade.updateProfile).toHaveBeenCalledWith({
      email: 'test@example.com',
      name: 'Test',
    });
  });
});
