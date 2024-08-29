import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { map, Subject, take, takeUntil } from 'rxjs';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { DestroyService } from '@/core/services/destroy/destroy.service';
import { StationsFacadeService } from '@/features/stations-management/services/stations-facade.service';
import { SearchRequest, SearchStation } from '@/core/models/search.model';
import { SearchFacadeService } from '../../services/search-facade/search-facade.service';
import { CityApiService } from '../../services/city-api/city-api.service';
import { localISOString, uniqueStations } from '../../utils';

@Component({
  selector: 'app-search-form',
  standalone: true,
  providers: [DestroyService],
  imports: [
    ReactiveFormsModule,
    AutoCompleteModule,
    CalendarModule,
    ToastModule,
    InputIconModule,
    IconFieldModule,
  ],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss',
})
export class SearchFormComponent implements OnInit {
  private destroy$: Subject<void> = inject(DestroyService);

  private fb: FormBuilder = inject(FormBuilder);

  private stationsFacade = inject(StationsFacadeService);

  private searchFacade = inject(SearchFacadeService);

  public cityApiService = inject(CityApiService);

  public options: SearchStation[] = [];

  private stations: SearchStation[] = [];

  public minDate: Date = new Date();

  public searchForm = this.fb.group({
    from: new FormControl<SearchStation | null>(null, [Validators.required]),
    to: new FormControl<SearchStation | null>(null, [Validators.required]),
    date: new FormControl<Date | null>(null, [Validators.required]),
    time: new FormControl<Date | null>({ value: null, disabled: true }),
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
    const { query } = event;

    this.cityApiService
      .searchCity(query)
      .pipe(take(1))
      .subscribe((apiStations) => {
        const options = [...this.stations, ...apiStations];

        const filtered: SearchStation[] = [];

        options.forEach((opt) => {
          if (opt.city.toLowerCase().includes(query.toLowerCase())) {
            filtered.push(opt);
          }
        });

        this.options = uniqueStations(...filtered);
      });
  }

  public search() {
    const { value } = this.searchForm;

    const date = localISOString(value.date!).split('T')[0];
    const time = value.time ? localISOString(value.time).split('T')[1] : null;

    const params: SearchRequest = {
      fromLatitude: value.from!.latitude,
      fromLongitude: value.from!.longitude,
      toLatitude: value.to!.latitude,
      toLongitude: value.to!.longitude,
      time: time ? `${date}T${time}Z` : `${date}T00:00:00.000Z`,
    };

    this.searchFacade.search(params);
  }
}
