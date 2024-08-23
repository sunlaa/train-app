import { FilteredTickets } from '@/core/models/search.model';
import { selectSearchTickets } from '@/redux/selectors/search.selector';
import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TabViewModule } from 'primeng/tabview';
import { TicketCardComponent } from '../ticket-card/ticket-card.component';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [TicketCardComponent, TabViewModule, DatePipe, AsyncPipe, JsonPipe],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
})
export class ResultsComponent {
  store: Store = inject(Store);

  tickects$: Observable<FilteredTickets> =
    this.store.select(selectSearchTickets);

  tabs: { title: string; content: string }[] = [];
}
