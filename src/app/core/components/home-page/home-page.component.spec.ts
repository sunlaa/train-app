import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StationsFacadeService } from '@/features/stations-management/services/stations-facade.service';
import { MessageService } from 'primeng/api';
import {
  MockCityApi,
  MockSearchFacade,
  MockStationsFacade,
} from '@/testing/mocks';
import { SearchFacadeService } from '../../../features/search-tickets/services/search-facade/search-facade.service';
import { CityApiService } from '../../../features/search-tickets/services/city-api/city-api.service';

import { HomePageComponent } from './home-page.component';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [
        MessageService,
        {
          provide: StationsFacadeService,
          useClass: MockStationsFacade,
        },
        {
          provide: SearchFacadeService,
          useClass: MockSearchFacade,
        },
        {
          provide: CityApiService,
          useClass: MockCityApi,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
