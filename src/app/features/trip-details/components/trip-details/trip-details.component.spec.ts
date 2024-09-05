import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { StationsFacadeService } from '@/features/stations-management/services/stations-facade.service';
import { CarriagesFacadeService } from '@/features/carriages-management/services/carriages-facade.service';
import { AuthService } from '@/features/auth/services/auth.service';
import {
  MockAuthService,
  MockCarriagesFacade,
  MockNotificationService,
  MockOrdersFacade,
  MockProfileFacade,
  MockStationsFacade,
  MockTripDetails,
} from '@/testing/mocks';
import { MessageService } from 'primeng/api';
import { NotificationService } from '@/shared/services/notification.service';
import { OrdersFacadeService } from '@/features/orders/services/facade/orders-facade.service';
import { ProfileFacadeService } from '@/features/profile/services/profile-facade.service';
import { TripDetailsService } from '../../services/trip-details/trip.service';

import { TripDetailsComponent } from './trip-details.component';

describe('TripDetailsComponent', () => {
  let component: TripDetailsComponent;
  let fixture: ComponentFixture<TripDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripDetailsComponent],
      providers: [
        provideRouter([]),
        MessageService,
        { provide: AuthService, useClass: MockAuthService },
        { provide: StationsFacadeService, useClass: MockStationsFacade },
        { provide: CarriagesFacadeService, useClass: MockCarriagesFacade },
        { provide: TripDetailsService, useClass: MockTripDetails },
        { provide: NotificationService, useClass: MockNotificationService },
        { provide: OrdersFacadeService, useClass: MockOrdersFacade },
        { provide: ProfileFacadeService, useClass: MockProfileFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TripDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
