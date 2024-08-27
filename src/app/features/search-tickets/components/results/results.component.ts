import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { BadgeModule } from 'primeng/badge';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Observable } from 'rxjs';
import { FilteredTickets } from '@/core/models/search.model';
import { TicketCardComponent } from '../ticket-card/ticket-card.component';
import { SearchFacadeService } from '../../services/search-facade/search-facade.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    TicketCardComponent,
    TabViewModule,
    BadgeModule,
    ProgressSpinnerModule,
    DatePipe,
    AsyncPipe,
  ],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
})
export class ResultsComponent {
  private searcFacadeService: SearchFacadeService = inject(SearchFacadeService);

  public tickets$: Observable<FilteredTickets> =
    this.searcFacadeService.tickets$;

  public isLoading$ = this.searcFacadeService.isLoading$;

  public status$ = this.searcFacadeService.status$;
}
