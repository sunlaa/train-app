import { FilteredTickets } from '@/core/models/search.model';
import { selectSearchTickets } from '@/redux/selectors/search.selector';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TabViewChangeEvent, TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [TabViewModule, AsyncPipe, JsonPipe],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
})
export class ResultsComponent implements OnInit {
  store: Store = inject(Store);

  tickects$: Observable<FilteredTickets> =
    this.store.select(selectSearchTickets);

  tabs: { title: string; content: string }[] = [];

  ngOnInit() {
    this.tabs = [
      { title: 'Tab 1', content: 'Tab 1 Content' },
      { title: 'Tab 2', content: 'Tab 2 Content' },
      { title: 'Tab 3', content: 'Tab 3 Content' },
    ];
  }

  some(event: TabViewChangeEvent) {
    return event;
  }
}
