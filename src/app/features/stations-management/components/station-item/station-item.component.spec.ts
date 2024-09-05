import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockNotificationService, MockStationsFacade } from '@/testing/mocks';
import { NotificationService } from '@/shared/services/notification.service';
import { ConfirmationService } from 'primeng/api';
import { StationsFacadeService } from '../../services/stations-facade.service';

import { StationItemComponent } from './station-item.component';

describe('StationItemComponent', () => {
  let component: StationItemComponent;
  let fixture: ComponentFixture<StationItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StationItemComponent, NoopAnimationsModule],
      providers: [
        ConfirmationService,
        { provide: NotificationService, useClass: MockNotificationService },
        { provide: StationsFacadeService, useClass: MockStationsFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StationItemComponent);
    component = fixture.componentInstance;

    component.station = {
      id: 0,
      city: 'test',
      latitude: 0,
      longitude: 0,
      connectedTo: [],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
