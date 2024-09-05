import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationService } from '@/shared/services/notification.service';
import {
  MockCarriagesSection,
  MockNotificationService,
  MockRoutesFacade,
  MockStationsSection,
} from '@/testing/mocks';

import { RouteFormComponent } from './route-form.component';
import { StationsSectionService } from '../../services/stations-section.service';
import { CarriagesSectionService } from '../../services/carriages-section.service';
import { RoutesFacadeService } from '../../services/routes-facade.service';

describe('RouteFormComponent', () => {
  let component: RouteFormComponent;
  let fixture: ComponentFixture<RouteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteFormComponent],
      providers: [
        { provide: NotificationService, useClass: MockNotificationService },
        { provide: RoutesFacadeService, useClass: MockRoutesFacade },
        { provide: StationsSectionService, useClass: MockStationsSection },
        { provide: CarriagesSectionService, useClass: MockCarriagesSection },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RouteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
