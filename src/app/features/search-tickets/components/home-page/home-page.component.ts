import { Component } from '@angular/core';
import { SearchFormComponent } from '../search-form/search-form.component';
import { ResultsComponent } from '../results/results.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SearchFormComponent, ResultsComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {}
