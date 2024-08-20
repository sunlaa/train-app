import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subject, takeUntil } from 'rxjs';
import { correctDate } from '../../form-validators/correct-date';

@Component({
  selector: 'app-search-form',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss',
})
export class SearchFormComponent implements OnInit, OnDestroy {
  destroy$: Subject<void> = new Subject();

  fb: FormBuilder = inject(FormBuilder);

  options = ['Warsaw', 'Minsk', 'Madrid', 'Paris'];

  searchForm = this.fb.group({
    from: ['', Validators.required],
    to: ['', Validators.required],
    date: [this.initDateValue, [Validators.required, correctDate]],
    time: [{ value: '00:00', disabled: true }],
  });

  get date() {
    return this.searchForm.controls.date;
  }

  get time() {
    return this.searchForm.controls.time;
  }

  get initDateValue() {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date;
  }

  ngOnInit() {
    this.date.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (
        !this.date.hasError('correctDate') &&
        !this.date.hasError('required')
      ) {
        this.time.enable();
      } else {
        this.time.disable();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  dateFilter = (date: Date | null) => {
    const now = new Date();

    return (date || new Date()) > now;
  };

  search() {
    // console.log(this.searchForm.value);
  }
}
