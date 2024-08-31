import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ResultsComponent } from './features/search-tickets/components/results/results.component';
import { NotificationService } from './shared/services/notification.service';
import { HeaderComponent } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ResultsComponent, HeaderComponent],
  providers: [MessageService, NotificationService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'train-app';
}
