import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { ProfileModel } from '@/core/models/profile.model';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NotificationService } from '@/shared/services/notification.service';
import { ToastModule } from 'primeng/toast';
import { Router, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '@/features/auth/services/auth.service';
import { ProfileFacadeService } from '../../services/profile-facade.service';
import { ProfileFormContext } from '../../models/profile-form-context.model';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    InputTextModule,
    ReactiveFormsModule,
    NgTemplateOutlet,
    AsyncPipe,
    ProgressSpinnerModule,
    ToastModule,
    RouterLink,
    PasswordModule,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent implements OnInit {
  private profileFacade = inject(ProfileFacadeService);

  private notificationService = inject(NotificationService);

  private authService = inject(AuthService);

  private fb = inject(FormBuilder);

  private router = inject(Router);

  private isNameEdit: boolean = false;

  private isEmailEdit: boolean = false;

  private profileForm = this.fb.group({
    email: [''],
    name: [''],
  });

  profile!: ProfileModel;

  status$ = this.profileFacade.status$.pipe(take(2));

  password: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
  ]);

  isModalVisible: boolean = false;

  get isManager(): boolean {
    return this.profile.role === 'manager';
  }

  get emailControl(): UntypedFormControl {
    return this.profileForm.get('email') as UntypedFormControl;
  }

  get nameControl(): UntypedFormControl {
    return this.profileForm.get('name') as UntypedFormControl;
  }

  public ngOnInit(): void {
    this.profileFacade.loadProfile();

    this.profileFacade.profile$.subscribe((profile) => {
      this.profile = profile;
      this.profileForm.setValue({
        email: profile.email,
        name: profile.name,
      });
    });
  }

  public updatePassword(): void {
    this.profileFacade
      .updatePassword(this.password.value)
      .subscribe(({ isSuccess }) => {
        if (!isSuccess) {
          return this.notificationService.messageError(
            'Error occurs during password update',
          );
        }

        this.notificationService.messageSuccess('Password has been updated!');
        this.isModalVisible = false;
        this.password.reset();

        return true;
      });
  }

  public logout(): void {
    this.profileFacade.logout().subscribe(({ isSuccess }) => {
      if (!isSuccess) {
        return this.notificationService.messageError(
          'Error occurs during logout',
        );
      }

      this.authService.removeUserToken();
      return this.router.navigateByUrl('/');
    });
  }

  public showModalDialog(): void {
    this.isModalVisible = !this.isModalVisible;
  }

  public getContext(field: string): ProfileFormContext {
    switch (field) {
      case 'email': {
        return {
          isEditMode: this.isEmailEdit,
          field: this.profile.email,
          control: this.emailControl,
          title: 'Email',
          onEdit: this.toggleEditEmail.bind(this),
        };
      }
      case 'name': {
        return {
          isEditMode: this.isNameEdit,
          field: this.profile.name,
          control: this.nameControl,
          title: 'Name',
          onEdit: this.toggleEditName.bind(this),
        };
      }

      default:
        return {} as ProfileFormContext;
    }
  }

  public onSave(): void {
    this.profileFacade
      .updateProfile({
        email: this.emailControl.value,
        name: this.nameControl.value,
      })
      .subscribe(({ isSuccess }) => {
        if (!isSuccess) {
          return this.notificationService.messageError(
            'Error occurs during profile update',
          );
        }

        this.notificationService.messageSuccess('Profile has been updated!');
        return this.isEmailEdit
          ? this.toggleEditEmail()
          : this.toggleEditName();
      });
  }

  private toggleEditName(): void {
    this.isNameEdit = !this.isNameEdit;
  }

  private toggleEditEmail(): void {
    this.isEmailEdit = !this.isEmailEdit;
  }
}
