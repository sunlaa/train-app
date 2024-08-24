import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { Observable } from 'rxjs';
import { FilteredTickets } from '@/core/models/search.model';
import { TicketCardComponent } from '../ticket-card/ticket-card.component';
import { SearchFacadeService } from '../../services/search-facade/search-facade.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [TicketCardComponent, TabViewModule, DatePipe, AsyncPipe, JsonPipe],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
})
export class ResultsComponent {
  private searcFacadeService: SearchFacadeService = inject(SearchFacadeService);

  tickets$: Observable<FilteredTickets> = this.searcFacadeService.tickets$;

  tabs: { title: string; content: string }[] = [];
}
