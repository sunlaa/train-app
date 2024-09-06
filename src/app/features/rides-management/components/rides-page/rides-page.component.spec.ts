import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationService } from '@/shared/services/notification.service';
import {
  MockCarriagesFacade,
  MockNotificationService,
  MockRidesFacade,
  MockStationsFacade,
} from '@/testing/mocks';
import { provideRouter } from '@angular/router';
import { StationsFacadeService } from '@/features/stations-management/services/stations-facade.service';
import { CarriagesFacadeService } from '@/features/carriages-management/services/carriages-facade.service';

import { RidesPageComponent } from './rides-page.component';
import { RidesFacadeService } from '../../services/rides-facade.service';

describe('RidesPageComponent', () => {
  let component: RidesPageComponent;
  let fixture: ComponentFixture<RidesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RidesPageComponent],
      providers: [
        {
          provide: NotificationService,
          useClass: MockNotificationService,
        },
        {
          provide: StationsFacadeService,
          useClass: MockStationsFacade,
        },
        {
          provide: CarriagesFacadeService,
          useClass: MockCarriagesFacade,
        },
        {
          provide: RidesFacadeService,
          useClass: MockRidesFacade,
        },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RidesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
