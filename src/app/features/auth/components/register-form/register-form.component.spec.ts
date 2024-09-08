import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DestroyService } from '@/core/services/destroy/destroy.service';
import { provideRouter, Router } from '@angular/router';
import { MockAuthService } from '@/testing/mocks';
import { AuthService } from '../../services/auth.service';

import { RegisterFormComponent } from './register-form.component';

describe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterFormComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        DestroyService,
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterFormComponent);

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.signupForm).toBeTruthy();
    expect(component.email.value).toBe('');
    expect(component.password.value).toBe('');
    expect(component.confirmPassword.value).toBe('');
  });

  it('should add validation after first submit', () => {
    component.email.setValue('invalid-email');
    component.password.setValue('        ');
    component.confirmPassword.setValue('        ');

    expect(component.email.valid).toBeTruthy();
    expect(component.password.valid).toBeTruthy();

    component.onSubmit();

    expect(component.email.valid).toBeFalsy();
    expect(component.password.valid).toBeFalsy();
    expect(component.isFormInvalid).toBeTruthy();
  });

  it('should validate email field', () => {
    component.onSubmit();
    const emailControl = component.email;

    emailControl.setValue('');
    expect(emailControl.valid).toBeFalsy();
    expect(emailControl.hasError('required')).toBeTruthy();

    emailControl.setValue('invalid-email');
    expect(emailControl.valid).toBeFalsy();
    expect(emailControl.hasError('pattern')).toBeTruthy();

    emailControl.setValue('valid@example.com');
    expect(emailControl.valid).toBeTruthy();
  });

  it('should validate password and confirmPassword fields', () => {
    component.onSubmit();
    const passwordControl = component.password;
    const confirmPasswordControl = component.confirmPassword;

    passwordControl.setValue('');
    expect(passwordControl.valid).toBeFalsy();
    expect(passwordControl.hasError('required')).toBeTruthy();

    passwordControl.setValue('password123');
    confirmPasswordControl.setValue('password123');
    expect(confirmPasswordControl.valid).toBeTruthy();

    confirmPasswordControl.setValue('differentpassword');
    expect(confirmPasswordControl.hasError('passwordsDoNotMatch')).toBeTruthy();
  });

  it('should call authService.signup and navigate on success', () => {
    const authServiceSpy = jest
      .spyOn(authService, 'signup')
      .mockReturnValue(of(null));
    const routerSpy = jest.spyOn(router, 'navigate');

    component.email.setValue('test@example.com');
    component.password.setValue('password123');
    component.confirmPassword.setValue('password123');
    component.onSubmit();

    expect(authServiceSpy).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(routerSpy).toHaveBeenCalledWith(['/signin']);
  });

  it('should set email error if signup fails with notUnique', () => {
    jest.spyOn(authService, 'signup').mockReturnValue(of({ apiError: true }));

    component.email.setValue('test@example.com');
    component.password.setValue('password123');
    component.confirmPassword.setValue('password123');
    component.onSubmit();

    expect(component.email.hasError('notUnique')).toBeTruthy();
  });
});
