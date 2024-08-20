import { AbstractControl, ValidationErrors } from '@angular/forms';

export function correctDate(
  control: AbstractControl<Date>,
): ValidationErrors | null {
  const { value } = control;

  if (value < new Date()) {
    return { correctDate: {} };
  }

  return null;
}
