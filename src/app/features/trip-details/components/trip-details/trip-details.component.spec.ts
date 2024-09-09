import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { StationsFacadeService } from '@/features/stations-management/services/stations-facade.service';
import { CarriagesFacadeService } from '@/features/carriages-management/services/carriages-facade.service';
import { AuthService } from '@/features/auth/services/auth.service';
import { RidePageData, SeatEventData } from '@/core/models/trip.model';
import { signal } from '@angular/core';
import {
  MockAuthService,
  mockCarriageMap,
  MockCarriagesFacade,
  MockNotificationService,
  MockOrdersFacade,
  MockProfileFacade,
  mockStationMap,
  MockStationsFacade,
  MockTripDetails,
} from '@/testing/mocks';
import { MessageService } from 'primeng/api';
import { NotificationService } from '@/shared/services/notification.service';
import { OrdersFacadeService } from '@/features/orders/services/facade/orders-facade.service';
import { ProfileFacadeService } from '@/features/profile/services/profile-facade.service';
import { TripDetailsService } from '../../services/trip-details/trip.service';

import { TripDetailsComponent } from './trip-details.component';

const mockTripPageData: RidePageData = {
  carriages: ['carriage1', 'carriage2'],
  carriageMap: mockCarriageMap,
  header: {
    routeId: 222,
    rideId: 1,
    departureDate: 1234567,
    arrivalDate: 234567,
    stopInfo: [],
  },
  carriageList: [],
};

const mockParamMap = {
  get: () => '1',
};

const mockQueryParamMap = {
  get: (key: string) => {
    if (key === 'from') return '2';
    if (key === 'to') return '4';
    return undefined;
  },
};

describe('TripDetailsComponent', () => {
  let component: TripDetailsComponent;
  let fixture: ComponentFixture<TripDetailsComponent>;

  const mockActivatedRoute = {
    paramMap: of(mockParamMap),
    queryParamMap: of(mockQueryParamMap),
  };

  let tripService: TripDetailsService;
  let stationsFacade: StationsFacadeService;
  let notificationService: NotificationService;
  let carriageFacade: CarriagesFacadeService;
  let ordersFacade: OrdersFacadeService;
  let profileFacade: ProfileFacadeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripDetailsComponent],
      providers: [
        provideRouter([]),

        MessageService,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
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

    tripService = TestBed.inject(TripDetailsService);
    stationsFacade = TestBed.inject(StationsFacadeService);
    carriageFacade = TestBed.inject(CarriagesFacadeService);
    ordersFacade = TestBed.inject(OrdersFacadeService);
    notificationService = TestBed.inject(NotificationService);
    profileFacade = TestBed.inject(ProfileFacadeService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should extract params and load ride details on init', () => {
    jest
      .spyOn(tripService, 'getRideDetails')
      .mockReturnValue(of(mockTripPageData));
    // @ts-expect-error to test private method
    jest.spyOn(component, 'waitForLoading').mockReturnValue(of(null));
    // @ts-expect-error to test private method
    jest.spyOn(component, 'extractParams');

    stationsFacade.stationMap = signal(mockStationMap);
    carriageFacade.carriageMap = signal(mockCarriageMap);

    component.ngOnInit();

    // @ts-expect-error to test private method
    expect(component.extractParams).toHaveBeenCalledWith(
      mockParamMap,
      mockQueryParamMap,
    );
    expect(component.fromCity).toBe('city2');
    expect(component.toCity).toBe('city4');
    expect(tripService.getRideDetails).toHaveBeenCalledWith(
      1,
      2,
      4,
      mockCarriageMap,
      mockStationMap,
    );
    expect(component.pageData).toEqual(mockTripPageData);
  });

  it('should open modal when openModal is called', () => {
    component.openModal();
    expect(component.modalVisible).toBe(true);
  });

  it('should assign the variables in extractParams method', () => {
    // @ts-expect-error to test private method
    component.extractParams(mockParamMap, mockQueryParamMap);

    // @ts-expect-error to test private method
    expect(component.rideId).toBe(1);
    // @ts-expect-error to test private method
    expect(component.fromId).toBe(2);
    // @ts-expect-error to test private method
    expect(component.toId).toBe(4);
  });

  it('should handle seat selection correctly in getSeat method', () => {
    const seatEvent: SeatEventData = {
      seat: 1,
      carNumber: 1,
      seatIndex: 10,
    };
    component.getSeat(seatEvent);
    expect(component.selectedSeat).toEqual({ seat: 1, carNumber: 1 });
    // @ts-expect-error to test private method
    expect(component.seatIndex).toBe(10);
  });

  describe('makeOrder', () => {
    const setPrivateComponentVariables = (
      rideId: number,
      fromId: number,
      toId: number,
      seatIndex: number,
    ) => {
      // @ts-expect-error to test private method
      component.rideId = rideId;
      // @ts-expect-error to test private method
      component.fromId = fromId;
      // @ts-expect-error to test private method
      component.toId = toId;
      // @ts-expect-error to test private method
      component.seatIndex = seatIndex;
    };

    const setFacades = (status: string, errorMessage?: string) => {
      Object.defineProperty(ordersFacade, 'state$', {
        get: () =>
          of({
            status,
            error: errorMessage ? { message: errorMessage } : undefined,
          }),
      });
      Object.defineProperty(profileFacade, 'profile$', {
        get: () => of({ role: 'manager' }),
      });
    };

    beforeEach(() => {
      jest.spyOn(ordersFacade, 'makeOrder');
      jest.spyOn(notificationService, 'messageSuccess');
      jest.spyOn(notificationService, 'messageError');
    });

    it('should make an order and handle success case', () => {
      setFacades('success');
      setPrivateComponentVariables(1, 2, 2, 10);

      component.makeOrder();

      expect(ordersFacade.makeOrder).toHaveBeenCalledWith({
        rideId: 1,
        seat: 10,
        stationStart: 2,
        stationEnd: 2,
      });

      expect(notificationService.messageSuccess).toHaveBeenCalledWith(
        'The seat was successfully booked.',
      );
    });

    it('should show error notification if order fails', () => {
      setFacades('error', 'Failed');
      setPrivateComponentVariables(1, 2, 2, 10);

      component.makeOrder();

      expect(notificationService.messageError).toHaveBeenCalledWith('Failed');
    });

    it("should open modal if error message 'Ride is already booked'", () => {
      setFacades('error', 'Ride is already booked');
      setPrivateComponentVariables(1, 2, 2, 10);

      component.makeOrder();

      expect(component.bookedModalVisible).toBe(true);
    });
  });
});
