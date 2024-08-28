import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CarriageComponent } from '@/shared/components/carriage/carriage.component';
import { SearchFormComponent } from '../search-form/search-form.component';
import { ResultsComponent } from '../results/results.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    SearchFormComponent,
    ResultsComponent,
    RouterLink,
    CarriageComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
  rows: number = 16;

  leftSeats: number = 2;

  rightSeats: number = 3;

  fb: FormBuilder = inject(FormBuilder);

  form = this.fb.group({
    rows: this.fb.control(0),
    leftSeats: this.fb.control(0),
    rightSeats: this.fb.control(0),
  });

  ngOnInit() {
    this.form.valueChanges.subscribe((val) => {
      this.rows = val.rows || this.rows;
      this.leftSeats = val.leftSeats || this.leftSeats;
      this.rightSeats = val.rightSeats || this.rightSeats;
    });
  }
}
