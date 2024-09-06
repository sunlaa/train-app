import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NotificationService } from '@/shared/services/notification.service';
import { CarriagesFacadeService } from '@/features/carriages-management/services/carriages-facade.service';
import { StationsFacadeService } from '@/features/stations-management/services/stations-facade.service';
import {
  MockCarriagesFacade,
  MockNotificationService,
  MockRoutesFacade,
  MockStationsFacade,
} from '@/testing/mocks';
import { ConfirmationService } from 'primeng/api';
import { RoutesFacadeService } from '../../services/routes-facade.service';

import { RouteItemComponent } from './route-item.component';

describe('RouteItemComponent', () => {
  let component: RouteItemComponent;
  let fixture: ComponentFixture<RouteItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteItemComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: NotificationService, useClass: MockNotificationService },
        { provide: RoutesFacadeService, useClass: MockRoutesFacade },
        { provide: StationsFacadeService, useClass: MockStationsFacade },
        { provide: CarriagesFacadeService, useClass: MockCarriagesFacade },
        ConfirmationService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RouteItemComponent);
    component = fixture.componentInstance;

    component.route = { id: 0, path: [], carriages: [] };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
