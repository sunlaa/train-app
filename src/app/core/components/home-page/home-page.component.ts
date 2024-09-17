import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SearchFormComponent } from '../../../features/search-tickets/components/search-form/search-form.component';
import { ResultsComponent } from '../../../features/search-tickets/components/results/results.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SearchFormComponent, ResultsComponent, RouterLink],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {}
