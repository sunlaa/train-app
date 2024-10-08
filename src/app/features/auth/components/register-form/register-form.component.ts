import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormControl,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DestroyService } from '@/core/services/destroy/destroy.service';
import { takeUntil, tap } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    RouterLink,
    PasswordModule,
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
})
export class RegisterFormComponent implements OnInit {
  private fb = inject(FormBuilder);

  private authService = inject(AuthService);

  private destroy$ = inject(DestroyService);

  private router = inject(Router);

  private isFirstSubmit: boolean = true;

  signupForm: FormGroup = this.fb.group({
    email: [''],
    password: [''],
    confirmPassword: [''],
  });

  private emailValidators = [
    Validators.required,
    Validators.pattern(/^[\w\d_]+@[\w\d_]+.\w{2,7}$/),
  ];

  private passwordValidators = [
    Validators.required,
    Validators.minLength(8),
    this.noWhitespaceValidator,
  ];

  private confirmPasswordValidators = [
    this.confirmPasswordValidator.bind(this),
  ];

  isLoading: boolean = false;

  get email(): UntypedFormControl {
    return this.signupForm.get('email') as UntypedFormControl;
  }

  get password(): UntypedFormControl {
    return this.signupForm.get('password') as UntypedFormControl;
  }

  get confirmPassword(): UntypedFormControl {
    return this.signupForm.get('confirmPassword') as UntypedFormControl;
  }

  get isAllControlsDirty(): boolean {
    return (
      this.email.dirty && this.password.dirty && this.confirmPassword.dirty
    );
  }

  get matchPasswordsError(): Record<string, boolean> {
    return {
      passwordsDoNotMatch: true,
    };
  }

  get isFormInvalid(): boolean {
    return this.signupForm.invalid || this.silentIsFormInvalid();
  }

  ngOnInit(): void {
    this.confirmPassword.addValidators(this.confirmPasswordValidators);
    this.confirmPassword.updateValueAndValidity();
    this.password.valueChanges.subscribe(() => {
      if (!this.isPasswordsEqual() && this.confirmPassword.dirty) {
        this.confirmPassword.setErrors(this.matchPasswordsError);
      } else {
        this.confirmPassword.setErrors(null);
      }
    });
  }

  private silentIsFormInvalid() {
    return (
      !this.controlIsValid(this.email, this.emailValidators) ||
      !this.controlIsValid(this.password, this.passwordValidators) ||
      !this.controlIsValid(this.confirmPassword, this.confirmPasswordValidators)
    );
  }

  private controlIsValid(
    control: UntypedFormControl,
    validators: ((control: AbstractControl) => ValidationErrors | null)[],
  ) {
    return validators.every((v) => v(control) === null);
  }

  isControlHasError(control: UntypedFormControl, error: string): boolean {
    return control?.hasError(error) ?? false;
  }

  onSubmit(): void {
    if (this.isFirstSubmit) {
      this.addValidators();
    }

    this.isFirstSubmit = false;

    if (this.signupForm.invalid) return;

    this.isLoading = true;

    this.authService
      .signup({
        email: this.email.value,
        password: this.password.value,
      })
      .pipe(
        takeUntil(this.destroy$),
        tap(() => {
          this.isLoading = false;
        }),
      )
      .subscribe((response) => {
        if (response?.apiError) {
          this.email.setErrors({
            notUnique: true,
          });

          return;
        }

        this.router.navigate(['/signin']);
      });
  }

  private isPasswordsEqual(): boolean {
    return this.password.value === this.confirmPassword.value;
  }

  private confirmPasswordValidator(): ValidationErrors | null {
    if (!this.isPasswordsEqual()) {
      return this.matchPasswordsError;
    }

    return null;
  }

  private noWhitespaceValidator(control: FormControl): ValidationErrors | null {
    if (control.value) {
      return control.value.trim().length ? null : { whitespace: true };
    }
    return null;
  }

  private addValidators(): void {
    this.email.addValidators(this.emailValidators);
    this.email.markAsDirty();
    this.email.updateValueAndValidity();

    this.password.addValidators(this.passwordValidators);
    this.password.markAsDirty();
    this.password.updateValueAndValidity();
  }
}
