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
import { MessageService } from 'primeng/api';
import { NotificationService } from '@/shared/services/notification.service';
import { SearchRequest, SearchStation } from '@/core/models/search.model';
import { SearchFacadeService } from '../../services/search-facade/search-facade.service';
import { CityApiService } from '../../services/city-api/city-api.service';

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

  private cityApiService = inject(CityApiService);

  public options: SearchStation[] = [];

  private stations: SearchStation[] = [];

  public minDate: Date = new Date();

  public searchForm = this.fb.group({
    from: new FormControl<SearchStation | null>(null, [Validators.required]),
    to: new FormControl<SearchStation | null>(null, [Validators.required]),
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

    // this.from.valueChanges
    //   .pipe(
    //     tap((value) => {
    //       console.log(value);
    //     }),
    //   )
    //   .subscribe();
  }

  // ngAfterViewInit() {
  //   fromEvent(this.searchInput.nativeElement, 'input').pipe(
  //     map((event: Event) => (event.target as HTMLInputElement).value),
  //     filter((value) => value.length >= 3),
  //     debounceTime(500),
  //     distinctUntilChanged(),
  //     switchMap((query) => {
  //       console.log('Hello!');
  //       this.cityApiService.searchCity(query);
  //       return of(query);
  //     }),
  //   );
  // }

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
        this.stations = stations.map((s) => ({
          city: s.city,
          latitude: s.latitude,
          longitude: s.longitude,
        }));
      });
  }

  private initMinDate() {
    const today = new Date();
    this.minDate.setDate(today.getDate() + 1);
  }

  public getStations(event: AutoCompleteCompleteEvent) {
    const options = this.stations;
    const filtered: SearchStation[] = [];
    const { query } = event;

    this.cityApiService.searchCity(query);

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
