import { ComponentFixture, TestBed } from '@angular/core/testing';
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
