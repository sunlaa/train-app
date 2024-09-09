import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationService } from '@/shared/services/notification.service';
import {
  MockCarriagesFacade,
  MockNotificationService,
  MockStationsFacade,
} from '@/testing/mocks';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { StationsFacadeService } from '@/features/stations-management/services/stations-facade.service';
import { CarriagesFacadeService } from '@/features/carriages-management/services/carriages-facade.service';

import { of } from 'rxjs';
import { MockRidesFacade, MockRidesState } from '@/testing/mocks/rides';
import { RidesPageComponent } from './rides-page.component';
import { RidesFacadeService } from '../../services/rides-facade.service';

describe('RidesPageComponent', () => {
  let component: RidesPageComponent;
  let fixture: ComponentFixture<RidesPageComponent>;
  let mockRidesFacade: MockRidesFacade;
  let mockStationsFacade: MockStationsFacade;
  let mockCarriagesFacade: MockCarriagesFacade;
  let mockNotificationService: MockNotificationService;
  let router: Router;
  let activatedRoute: ActivatedRoute;

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
        {
          provide: ActivatedRoute,
          useValue: { params: of({ routeId: '123' }) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RidesPageComponent);
    component = fixture.componentInstance;

    mockRidesFacade = TestBed.inject(
      RidesFacadeService,
    ) as unknown as MockRidesFacade;
    mockStationsFacade = TestBed.inject(
      StationsFacadeService,
    ) as unknown as MockStationsFacade;
    mockCarriagesFacade = TestBed.inject(
      CarriagesFacadeService,
    ) as unknown as MockCarriagesFacade;
    mockNotificationService = TestBed.inject(
      NotificationService,
    ) as unknown as MockNotificationService;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle valid route parameters and load rides', () => {
    const loadSpy = jest.spyOn(mockRidesFacade, 'load');
    component.ngOnInit();
    expect(loadSpy).toHaveBeenCalledWith(123);
  });

  it('should handle invalid route parameters', () => {
    jest
      .spyOn(activatedRoute.params, 'pipe')
      .mockReturnValue(of({ routeId: 'invalid' }));
    component.ngOnInit();
    expect(component.ridesState).toEqual({
      route: undefined,
      status: 'error',
      error: { message: 'Invalid route id', reason: 'invalidRouteId' },
    });
  });

  it('should call loadStationsAndCarriages on successful state', () => {
    const loadStationsAndCarriagesSpy = jest.spyOn(
      component,
      // @ts-expect-error test
      'loadStationsAndCarriages',
    );
    mockRidesFacade.setState(MockRidesState.successState);
    component.ngOnInit();
    expect(loadStationsAndCarriagesSpy).toHaveBeenCalled();
  });

  it('should update station and carriage names based on state', () => {
    const stations = [{ id: 1, city: 'City A' }];
    const carriages = [{ code: 'A1', name: 'Carriage A' }];
    // @ts-expect-error test
    mockStationsFacade.stations$ = of(stations);
    // @ts-expect-error test
    mockCarriagesFacade.carriages$ = of(carriages);
    component.ridesState = {
      route: { id: 1, path: [1], carriages: ['A1'], schedule: [] },
      status: 'success',
      error: null,
    };
    component.ngOnInit();
    expect(component.stations).toEqual([{ id: 1, name: 'City A' }]);
    expect(component.carriages).toEqual([{ id: 'A1', name: 'Carriage A' }]);
  });

  it('should display loading spinner when state is loading', () => {
    mockRidesFacade.setState(MockRidesState.loadingState);
    fixture.detectChanges();
    const spinnerElement =
      fixture.nativeElement.querySelector('.loading-wrapper');
    expect(spinnerElement).toBeTruthy();
  });

  it('should display error message when state has error', () => {
    component.ridesState = MockRidesState.errorState;
    fixture.detectChanges();
    const errorElement = fixture.nativeElement.querySelector('p');
    expect(errorElement.textContent.trim()).toContain('Some error');
  });

  it('should handle rideCreateEvent', () => {
    const rideCreateSpy = jest
      .spyOn(mockRidesFacade, 'create')
      .mockReturnValue(of(MockRidesState.successState));
    component.rideCreateEvent({ segments: [] });
    expect(rideCreateSpy).toHaveBeenCalled();
  });

  it('should handle rideCreateEvent error', () => {
    const rideCreateSpy = jest
      .spyOn(mockRidesFacade, 'create')
      .mockReturnValue(of(MockRidesState.errorState));
    const messageConfirmSpy = jest.spyOn(
      mockNotificationService,
      'messageError',
    );
    component.rideCreateEvent({ segments: [] });
    expect(rideCreateSpy).toHaveBeenCalled();
    expect(messageConfirmSpy).toHaveBeenCalledWith('Some error');
  });

  it('should handle rideChangeEvent', () => {
    const rideChangeSpy = jest
      .spyOn(mockRidesFacade, 'update')
      .mockReturnValue(of(MockRidesState.successState));
    component.rideChangeEvent({ rideId: 1, segments: [] });
    expect(rideChangeSpy).toHaveBeenCalled();
  });

  it('should handle rideChangeEvent error', () => {
    const rideChangeSpy = jest
      .spyOn(mockRidesFacade, 'update')
      .mockReturnValue(of(MockRidesState.errorState));
    const messageConfirmSpy = jest.spyOn(
      mockNotificationService,
      'messageError',
    );
    component.rideChangeEvent({ rideId: 1, segments: [] });
    expect(rideChangeSpy).toHaveBeenCalled();
    expect(messageConfirmSpy).toHaveBeenCalledWith('Some error');
  });

  it('should handle rideDeleteEvent and show confirm message', () => {
    const rideDeleteSpy = jest
      .spyOn(mockRidesFacade, 'delete')
      .mockReturnValue(of(MockRidesState.successState));
    const messageConfirmSpy = jest.spyOn(
      mockNotificationService,
      'messageConfirm',
    );
    component.rideDeleteEvent(1);
    expect(rideDeleteSpy).toHaveBeenCalled();
    expect(messageConfirmSpy).toHaveBeenCalledWith('Ride deleted');
  });

  it('should handle rideDeleteEvent and show error message on failure', () => {
    const rideDeleteSpy = jest
      .spyOn(mockRidesFacade, 'delete')
      .mockReturnValue(of(MockRidesState.errorState));
    const messageErrorSpy = jest.spyOn(mockNotificationService, 'messageError');
    component.rideDeleteEvent(1);
    expect(rideDeleteSpy).toHaveBeenCalled();
    expect(messageErrorSpy).toHaveBeenCalledWith('Some error');
  });

  it('should toggle form visibility on createClick', () => {
    component.createClick();
    expect(component.formToggle).toBe(true);
  });

  it('should navigate back on backClick', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.backClick();
    expect(navigateSpy).toHaveBeenCalledWith(['../'], {
      relativeTo: activatedRoute,
    });
  });

  it('should close form on closeFormEvent', () => {
    component.formToggle = true;
    component.closeFormEvent();
    expect(component.formToggle).toBe(false);
  });

  it('should handle route parameters correctly', () => {
    jest
      .spyOn(activatedRoute.params, 'pipe')
      .mockReturnValue(of({ routeId: '123' }));
    const loadSpy = jest.spyOn(mockRidesFacade, 'load');

    component.ngOnInit();

    // @ts-expect-error test
    expect(component.routeId).toBe(123);
    expect(loadSpy).toHaveBeenCalledWith(123);
  });

  it('should handle invalid route parameters and set error state', () => {
    jest
      .spyOn(activatedRoute.params, 'pipe')
      .mockReturnValue(of({ routeId: 'invalid' }));

    component.ngOnInit();

    expect(component.ridesState).toEqual({
      route: undefined,
      status: 'error',
      error: { message: 'Invalid route id', reason: 'invalidRouteId' },
    });
  });

  it('should load stations and carriages on successful state', () => {
    const loadStationsSpy = jest.spyOn(mockStationsFacade, 'load');
    const loadCarriagesSpy = jest.spyOn(mockCarriagesFacade, 'load');

    mockRidesFacade.setState(MockRidesState.successState);
    component.ngOnInit();

    expect(loadStationsSpy).toHaveBeenCalled();
    expect(loadCarriagesSpy).toHaveBeenCalled();
  });
});
