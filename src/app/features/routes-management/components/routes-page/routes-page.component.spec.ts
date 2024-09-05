import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { StationsFacadeService } from '@/features/stations-management/services/stations-facade.service';
import {
  MockCarriagesFacade,
  MockRoutesFacade,
  MockStationsFacade,
} from '@/testing/mocks';
import { CarriagesFacadeService } from '@/features/carriages-management/services/carriages-facade.service';
import { RoutesFacadeService } from '../../services/routes-facade.service';

import { RoutesPageComponent } from './routes-page.component';

describe('RoutesPageComponent', () => {
  let component: RoutesPageComponent;
  let fixture: ComponentFixture<RoutesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutesPageComponent],
      providers: [
        MessageService,
        { provide: StationsFacadeService, useClass: MockStationsFacade },
        { provide: CarriagesFacadeService, useClass: MockCarriagesFacade },
        { provide: RoutesFacadeService, useClass: MockRoutesFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RoutesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
