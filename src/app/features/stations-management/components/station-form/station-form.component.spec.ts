import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationService } from '@/shared/services/notification.service';
import { MockNotificationService, MockStationsFacade } from '@/testing/mocks';

import { StationFormComponent } from './station-form.component';
import { StationsFacadeService } from '../../services/stations-facade.service';

describe('StationFormComponent', () => {
  let component: StationFormComponent;
  let fixture: ComponentFixture<StationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StationFormComponent],
      providers: [
        { provide: NotificationService, useClass: MockNotificationService },
        { provide: StationsFacadeService, useClass: MockStationsFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
