import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import {
  MockStationsData,
  MockStationsFacade,
  MockStationsState,
} from '@/testing/mocks';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StationsFacadeService } from '../../services/stations-facade.service';

import { StationsPageComponent } from './stations-page.component';

describe('StationsPageComponent', () => {
  let component: StationsPageComponent;
  let fixture: ComponentFixture<StationsPageComponent>;
  let facadeService: MockStationsFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StationsPageComponent, BrowserAnimationsModule],
      providers: [
        MessageService,
        { provide: StationsFacadeService, useClass: MockStationsFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StationsPageComponent);
    component = fixture.componentInstance;

    facadeService = TestBed.inject(
      StationsFacadeService,
    ) as unknown as MockStationsFacade;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update pageStations on state change', () => {
    const mockStations = MockStationsData.listedStations;
    component.allStations = mockStations;
    component.onPageChange({ first: 0, rows: 4 });
    fixture.detectChanges();
    expect(component.pageStations.length).toBe(4);
  });

  it('should update offset and stationsPerPage on page change', () => {
    component.onPageChange({ first: 5, rows: 10 });
    expect(component.offset).toBe(5);
    expect(component.stationsPerPage).toBe(10);
  });

  it('should render skeletons when no stations available', () => {
    component.pageStations = [];
    fixture.detectChanges();
    const skeletons = fixture.debugElement.queryAll(By.css('p-skeleton'));
    expect(skeletons.length).toBe(5);
  });

  it('should render StationItemComponents for each pageStation', () => {
    const mockStations = MockStationsData.listedStations.slice(0, 3);
    component.pageStations = mockStations;
    fixture.detectChanges();
    const stationItems = fixture.debugElement.queryAll(
      By.css('app-station-item'),
    );
    expect(stationItems.length).toBe(3);
    expect(stationItems[0].componentInstance.station).toBe(mockStations[0]);
  });

  it('should update component state when state$ emits a non-loading status', () => {
    const stations = MockStationsData.listedStations;

    facadeService.setState(MockStationsState.successState);

    fixture.detectChanges();

    expect(component.allStations).toEqual(stations);
    expect(component.totalStations).toBe(stations.length);
    expect(component.pageStations).toEqual(
      stations.slice(
        component.offset,
        component.stationsPerPage + component.offset,
      ),
    );
  });
});
