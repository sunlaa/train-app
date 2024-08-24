import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { DestroyService } from '@/core/services/destroy/destroy.service';

@Component({
  selector: 'app-search-form',
  standalone: true,
  providers: [DestroyService],
  imports: [ReactiveFormsModule, AutoCompleteModule, CalendarModule],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss',
})
export class SearchFormComponent implements OnInit {
  private destroy$: Subject<void> = inject(DestroyService);

  private fb: FormBuilder = inject(FormBuilder);

  public options: string[] = [];

  public minDate: Date = new Date();

  public searchForm = this.fb.group({
    from: ['', Validators.required],
    to: ['', Validators.required],
    date: ['', [Validators.required]],
    time: [{ value: '', disabled: true }],
  });

  get from() {
    return this.searchForm.controls.from;
  }

  get to() {
    return this.searchForm.controls.to;
  }

  get date() {
    return this.searchForm.controls.date;
  }

  get time() {
    return this.searchForm.controls.time;
  }

  ngOnInit() {
    this.date.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (!this.date.hasError('required')) {
        this.time.enable();
      } else {
        this.time.disable();
      }
    });

    const today = new Date();
    this.minDate.setDate(today.getDate() + 1);
  }

  public getCountries(event: AutoCompleteCompleteEvent) {
    const options = ['Warsaw', 'Minsk', 'Madrid', 'Paris'];
    const filtered: string[] = [];
    const { query } = event;

    options.forEach((opt) => {
      if (opt.toLowerCase().includes(query.toLowerCase())) {
        filtered.push(opt);
      }
    });

    this.options = filtered;
  }

  search() {
    return this.searchForm.value;
  }
}
