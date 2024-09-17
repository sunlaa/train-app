import { UntypedFormControl } from '@angular/forms';
import { Role } from './auth.model';

export type ProfileModel = {
  role: Role;
  name: string;
  email: string;
};

export interface ProfileFormContext {
  field: string;
  control: UntypedFormControl;
  title: string;
  isEditMode: boolean;
  onEdit: () => void;
}
