import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ResultsComponent } from './features/search-tickets/components/results/results.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ResultsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'train-app';
}
