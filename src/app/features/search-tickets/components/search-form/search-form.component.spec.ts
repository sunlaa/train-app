import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { of } from 'rxjs';
import {
  MockCityApi,
  MockSearchFacade,
  MockStationsFacade,
} from '@/testing/mocks';
import { MessageService } from 'primeng/api';
import { StationsFacadeService } from '@/features/stations-management/services/stations-facade.service';
import { SearchFacadeService } from '../../services/search-facade/search-facade.service';
import { CityApiService } from '../../services/city-api/city-api.service';

import { SearchFormComponent } from './search-form.component';

describe('SearchFormComponent', () => {
  let component: SearchFormComponent;
  let fixture: ComponentFixture<SearchFormComponent>;
  let stationsFacade: StationsFacadeService;
  let apiService: CityApiService;
  let searchFacade: SearchFacadeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFormComponent],
      providers: [
        MessageService,
        {
          provide: SearchFacadeService,
          useClass: MockSearchFacade,
        },
        {
          provide: StationsFacadeService,
          useClass: MockStationsFacade,
        },
        {
          provide: CityApiService,
          useClass: MockCityApi,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchFormComponent);
    component = fixture.componentInstance;

    stationsFacade = TestBed.inject(StationsFacadeService);
    apiService = TestBed.inject(CityApiService);
    searchFacade = TestBed.inject(SearchFacadeService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize searchForm with default values', () => {
    expect(component.from.value).toBeNull();
    expect(component.to.value).toBeNull();
    expect(component.date.value).toBeNull();
    expect(component.time.disabled).toBe(true);
  });

  it('should get all stations and update the stations list', () => {
    Object.defineProperty(stationsFacade, 'state$', {
      get: () =>
        of({ stations: [{ city: 'City A', latitude: 10, longitude: 20 }] }),
    });

    component.ngOnInit();

    fixture.detectChanges();

    // @ts-expect-error to test private method
    expect(component.stations.length).toBe(1);
    // @ts-expect-error to test private method
    expect(component.stations[0].city).toBe('City A');
  });

  it('should disable and enable time input', () => {
    component.date.setValue(new Date());

    expect(component.time.disabled).toBe(false);

    component.date.setValue(null);

    expect(component.time.disabled).toBe(true);
  });

  it('should filter stations based on the query and update options', () => {
    const event: AutoCompleteCompleteEvent = {
      query: 'lon',
      originalEvent: new Event('input'),
    };

    const existingStations = [
      { city: 'Loneliness', latitude: 1, longitude: 1 },
      { city: 'Paris', latitude: 1, longitude: 1 },
    ];

    const apiStations = [
      { city: 'London', latitude: 1, longitude: 1 },
      { city: 'Berlin', latitude: 1, longitude: 1 },
    ];

    // @ts-expect-error to test private method
    component.stations = existingStations;

    jest.spyOn(apiService, 'searchCity').mockReturnValue(of(apiStations));

    component.getStations(event);

    expect(apiService.searchCity).toHaveBeenCalledWith('lon');

    expect(component.options).toEqual([
      { city: 'Loneliness', latitude: 1, longitude: 1 },
      { city: 'London', latitude: 1, longitude: 1 },
    ]);
  });

  it('should correctly format date and time, and call search with correct parameters', () => {
    const fromLatitude = 12.123;
    const fromLongitude = -5.453;
    const toLatitude = 10.536;
    const toLongitude = -12.263;

    const dateValue = new Date('2050-09-20T00:00:00:000'); // September 20, 2050, 00:00
    const timeValue = new Date('2024-09-08T11:30:00:000'); // September 08, 2024, 11:30
    const expectedValue1 = new Date('2050-09-20T11:30:00:000').getTime(); // September 20, 2050, 11:30

    component.date.setValue(dateValue);
    component.from.setValue({
      city: 'TestFrom',
      latitude: fromLatitude,
      longitude: fromLongitude,
    });
    component.to.setValue({
      city: 'TestTo',
      latitude: toLatitude,
      longitude: toLongitude,
    });

    jest.spyOn(searchFacade, 'search');

    component.search();

    const expectedValue2 = dateValue.getTime();

    expect(searchFacade.search).toHaveBeenCalledWith({
      fromLatitude,
      fromLongitude,
      toLatitude,
      toLongitude,
      time: expectedValue2,
    });

    component.time.setValue(timeValue);

    component.search();

    expect(searchFacade.search).toHaveBeenCalledWith({
      fromLatitude,
      fromLongitude,
      toLatitude,
      toLongitude,
      time: expectedValue1,
    });
  });
});
