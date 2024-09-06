import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideRouter, Router } from '@angular/router';
import { MockAuthService } from '@/testing/mocks';
import { AuthService } from '../../services/auth.service';

import { LoginFormComponent } from './login-form.component';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.loginForm.value).toEqual({ email: '', password: '' });
  });

  it('should add validation after first submit', () => {
    component.email.setValue('invalid-email');
    component.password.setValue('   ');

    expect(component.email.valid).toBeTruthy();
    expect(component.password.valid).toBeTruthy();

    component.onSubmit();

    expect(component.email.valid).toBeFalsy();
    expect(component.password.valid).toBeFalsy();
    expect(component.isFormInvalid).toBeTruthy();
  });

  it('should validate email field correctly', () => {
    component.onSubmit();
    const emailControl = component.email;

    emailControl.setValue('invalid-email');
    expect(emailControl.valid).toBeFalsy();
    expect(emailControl.hasError('pattern')).toBeTruthy();

    emailControl.setValue('valid@example.com');
    expect(emailControl.valid).toBeTruthy();
  });

  it('should validate password field correctly', () => {
    component.onSubmit();
    const passwordControl = component.password;

    passwordControl.setValue('   ');
    expect(passwordControl.valid).toBeFalsy();
    expect(passwordControl.hasError('whitespace')).toBeTruthy();

    passwordControl.setValue('validpassword');
    expect(passwordControl.valid).toBeTruthy();
  });

  it('should call AuthService.signin on form submit', () => {
    const signinSpy = jest
      .spyOn(authService, 'signin')
      .mockReturnValue(of(null));

    component.email.setValue('valid@example.com');
    component.password.setValue('validpassword');

    component.onSubmit();

    expect(signinSpy).toHaveBeenCalledWith({
      email: 'valid@example.com',
      password: 'validpassword',
    });
  });

  it('should handle AuthService.signin error', async () => {
    const signinSpy = jest
      .spyOn(authService, 'signin')
      .mockReturnValue(of({ apiError: true }));

    component.email.setValue('valid@example.com');
    component.password.setValue('validpassword');

    component.onSubmit();

    expect(signinSpy).toHaveBeenCalledWith({
      email: 'valid@example.com',
      password: 'validpassword',
    });
    expect(component.email.hasError('incorrectEmailOrPassword')).toBeTruthy();
    expect(
      component.password.hasError('incorrectEmailOrPassword'),
    ).toBeTruthy();
  });

  it('should navigate to home on successful login if isRedirect is true', () => {
    const navigateSpy = jest.spyOn(router, 'navigateByUrl');
    jest.spyOn(authService, 'signin').mockReturnValue(of(null));

    component.email.setValue('valid@example.com');
    component.password.setValue('validpassword');

    component.onSubmit();

    expect(navigateSpy).toHaveBeenCalledWith('/');
  });

  it('should not navigate on successful login if isRedirect is false', () => {
    component.isRedirect = false;
    const navigateSpy = jest.spyOn(router, 'navigateByUrl');
    jest.spyOn(authService, 'signin').mockReturnValue(of(null));

    component.email.setValue('valid@example.com');
    component.password.setValue('validpassword');

    component.onSubmit();

    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
