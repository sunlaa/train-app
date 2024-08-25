import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { map, Subject, takeUntil } from 'rxjs';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { DestroyService } from '@/core/services/destroy/destroy.service';
import { StationsFacadeService } from '@/features/stations-management/services/stations-facade.service';
import { TStationListed } from '@/core/models/stations.model';
import { MessageService } from 'primeng/api';
import { NotificationService } from '@/shared/services/notification.service';
import { SearchRequest } from '@/core/models/search.model';
import { SearchFacadeService } from '../../services/search-facade/search-facade.service';

@Component({
  selector: 'app-search-form',
  standalone: true,
  providers: [DestroyService, MessageService, NotificationService],
  imports: [
    ReactiveFormsModule,
    AutoCompleteModule,
    CalendarModule,
    ToastModule,
  ],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss',
})
export class SearchFormComponent implements OnInit {
  private destroy$: Subject<void> = inject(DestroyService);

  private fb: FormBuilder = inject(FormBuilder);

  private stationsFacade = inject(StationsFacadeService);

  private searchFacade = inject(SearchFacadeService);

  private notification = inject(NotificationService);

  public options: TStationListed[] = [];

  private stations: TStationListed[] = [];

  public minDate: Date = new Date();

  public searchForm = this.fb.group({
    from: new FormControl<TStationListed | null>(null, [Validators.required]),
    to: new FormControl<TStationListed | null>(null, [Validators.required]),
    date: new FormControl<Date | null>(null, [Validators.required]),
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
    this.getAllStations();
    this.enableTimeInputCheck();
    this.initMinDate();
  }

  private enableTimeInputCheck() {
    this.date.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (!this.date.hasError('required')) {
        this.time.enable();
      } else {
        this.time.disable();
      }
    });
  }

  private getAllStations() {
    this.stationsFacade.state$
      .pipe(
        map(({ stations }) => stations),
        takeUntil(this.destroy$),
      )
      .subscribe((stations) => {
        this.stations = stations;
      });
  }

  private initMinDate() {
    const today = new Date();
    this.minDate.setDate(today.getDate() + 1);
  }

  public getStations(event: AutoCompleteCompleteEvent) {
    const options = this.stations;
    const filtered: TStationListed[] = [];
    const { query } = event;

    options.forEach((opt) => {
      if (opt.city.toLowerCase().includes(query.toLowerCase())) {
        filtered.push(opt);
      }
    });

    this.options = filtered;
  }

  search() {
    const { value } = this.searchForm;

    const params: SearchRequest = {
      fromLatitude: value.from!.latitude,
      fromLongitude: value.from!.longitude,
      toLatitude: value.to!.latitude,
      toLongitude: value.to!.longitude,
      time: value.date!.toISOString(),
    };

    const state$ = this.searchFacade.search(params);

    state$.subscribe((state) => {
      if (state.status === 'error') {
        this.notification.messageError(state.error?.message);
      }
    });
  }
}
