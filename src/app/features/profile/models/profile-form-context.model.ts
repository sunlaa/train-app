import { UntypedFormControl } from '@angular/forms';

export interface ProfileFormContext {
  field: string;
  control: UntypedFormControl;
  title: string;
  isEditMode: boolean;
  onEdit: () => void;
}
