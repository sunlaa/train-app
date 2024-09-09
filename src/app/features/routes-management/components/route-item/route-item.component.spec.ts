import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
  let notificationService: MockNotificationService;
  let stationsFacade: MockStationsFacade;
  let carriagesFacade: MockCarriagesFacade;
  let confirmationService: ConfirmationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteItemComponent, BrowserAnimationsModule],
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

    component.route = { id: 1, path: [], carriages: [] };
    notificationService = TestBed.inject(
      NotificationService,
    ) as unknown as MockNotificationService;
    stationsFacade = TestBed.inject(
      StationsFacadeService,
    ) as unknown as MockStationsFacade;
    carriagesFacade = TestBed.inject(
      CarriagesFacadeService,
    ) as unknown as MockCarriagesFacade;
    confirmationService = TestBed.inject(ConfirmationService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit editRouteClick when editClick is called', () => {
    jest.spyOn(component.editRouteClick, 'emit');
    component.editClick();
    expect(component.editRouteClick.emit).toHaveBeenCalledWith(component.route);
  });

  it('should navigate to the route when assignRideClick is called', () => {
    const router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate');
    component.assignRideClick();
    expect(router.navigate).toHaveBeenCalledWith([component.route.id], {
      // @ts-expect-error to test private property
      relativeTo: component.activatedRoute,
    });
  });

  it('should show confirmation dialog when deleteClick is called', () => {
    jest.spyOn(confirmationService, 'confirm');
    const event = new Event('click');
    component.deleteClick(event);
    expect(confirmationService.confirm).toHaveBeenCalled();
  });

  it('should display stations and carriages after loading', () => {
    component.route = { id: 1, path: [1], carriages: ['A1'] };

    stationsFacade.setStationsMap({
      1: { id: 1, city: 'City 1', latitude: 0, longitude: 0, connectedTo: [] },
    });
    carriagesFacade.setCarriageMap({
      A1: {
        code: 'A1',
        name: 'Economy',
        rows: 0,
        leftSeats: 0,
        rightSeats: 0,
        seats: 0,
      },
    });

    fixture.detectChanges();

    expect(component.stations).toBe('City 1');
    expect(component.carriages).toBe('Economy');
  });

  it('should call loadStationsAndCarriages on init', () => {
    // @ts-expect-error to test private method
    const spy = jest.spyOn(component, 'loadStationsAndCarriages');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should reload stations and carriages when route changes', () => {
    // @ts-expect-error to test private method
    const spy = jest.spyOn(component, 'loadStationsAndCarriages');
    component.route = { id: 2, path: [2], carriages: ['B2'] };

    component.ngOnChanges({
      route: {
        currentValue: component.route,
        previousValue: { id: 1 },
        firstChange: false,
        isFirstChange: () => false,
      },
    });

    expect(spy).toHaveBeenCalled();
  });

  it('should handle undefined stations', () => {
    component.route = { id: 1, path: [999], carriages: ['C999'] };

    stationsFacade.setStationsMap({});
    carriagesFacade.setCarriageMap({});

    fixture.detectChanges();

    expect(component.stations).toBe(undefined);
    expect(component.carriages).toBe(undefined);
  });

  it('should emit deleteRoute and show success message when route is deleted', () => {
    const confirmSpy = jest.spyOn(confirmationService, 'confirm');
    jest.spyOn(component.deleteRoute, 'emit');
    jest.spyOn(notificationService, 'messageSuccess');

    component.route = { id: 1, path: [], carriages: [] };
    const event = new Event('click');

    // Simulate confirmation dialog acceptance
    component.deleteClick(event);

    const confirmationArgs = confirmSpy.mock.calls[0][0];
    if (confirmationArgs.accept) {
      confirmationArgs.accept();
    }

    expect(component.deleteRoute.emit).toHaveBeenCalledWith(component.route);
    expect(notificationService.messageSuccess).toHaveBeenCalledWith(
      'Route deleted',
    );
  });
});
