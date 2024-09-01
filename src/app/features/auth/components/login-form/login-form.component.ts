import { DestroyService } from '@/core/services/destroy/destroy.service';
import { Component, inject, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { takeUntil, tap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Router, RouterLink } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    RouterLink,
    PasswordModule,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {
  @Input() isRedirect: boolean = true;

  private fb = inject(FormBuilder);

  private authService = inject(AuthService);

  private destroy$ = inject(DestroyService);

  private router = inject(Router);

  private isFirstSubmit: boolean = true;

  loginForm: FormGroup = this.fb.group({
    email: [''],
    password: [''],
  });

  isLoading: boolean = false;

  get email(): UntypedFormControl {
    return this.loginForm.get('email') as UntypedFormControl;
  }

  get password(): UntypedFormControl {
    return this.loginForm.get('password') as UntypedFormControl;
  }

  get isAllControlsDirty(): boolean {
    return this.password.dirty && this.email.dirty;
  }

  get isFormInvalid(): boolean {
    return !this.isAllControlsDirty || this.loginForm.invalid;
  }

  isControlHasError(control: UntypedFormControl, error: string): boolean {
    return control?.hasError(error) ?? false;
  }

  onSubmit(): void {
    if (this.isFirstSubmit) {
      this.addValidators();
    }

    this.isFirstSubmit = false;

    if (this.loginForm.invalid) return;

    this.isLoading = true;

    this.authService
      .signin({
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
            incorrectEmailOrPassword: true,
          });

          this.password.setErrors({
            incorrectEmailOrPassword: true,
          });

          return;
        }

        if (this.isRedirect) this.router.navigateByUrl('/');
      });
  }

  private addValidators(): void {
    this.email.addValidators([
      Validators.required,
      Validators.pattern(/^[\w\d_]+@[\w\d_]+.\w{2,7}$/),
    ]);
    this.email.markAsDirty();
    this.email.updateValueAndValidity();

    this.password.addValidators(Validators.required);
    this.password.markAsDirty();
    this.password.updateValueAndValidity();
  }
}
