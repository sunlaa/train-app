import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { StationsFacadeService } from '@/features/stations-management/services/stations-facade.service';
import {
  MockCarriagesFacade,
  MockRoutesFacade,
  MockStationsFacade,
} from '@/testing/mocks';
import { CarriagesFacadeService } from '@/features/carriages-management/services/carriages-facade.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockRoutesData } from '@/testing/mocks/routes';
import { RoutesFacadeService } from '../../services/routes-facade.service';

import { RoutesPageComponent } from './routes-page.component';

describe('RoutesPageComponent', () => {
  const mockActivatedRoute = {
    snapshot: {
      params: { id: '1' },
      queryParams: {},
    },
    params: of({ id: '1' }),
    queryParams: of({}),
  };
  let component: RoutesPageComponent;
  let fixture: ComponentFixture<RoutesPageComponent>;
  let stationsFacade: MockStationsFacade;
  let carriagesFacade: MockCarriagesFacade;
  let routesFacade: MockRoutesFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutesPageComponent, BrowserAnimationsModule],
      providers: [
        MessageService,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: StationsFacadeService, useClass: MockStationsFacade },
        { provide: CarriagesFacadeService, useClass: MockCarriagesFacade },
        { provide: RoutesFacadeService, useClass: MockRoutesFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RoutesPageComponent);
    component = fixture.componentInstance;
    stationsFacade = TestBed.inject(
      StationsFacadeService,
    ) as unknown as MockStationsFacade;
    carriagesFacade = TestBed.inject(
      CarriagesFacadeService,
    ) as unknown as MockCarriagesFacade;
    routesFacade = TestBed.inject(
      RoutesFacadeService,
    ) as unknown as MockRoutesFacade;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load initial data on init', () => {
    jest.spyOn(stationsFacade, 'load');
    jest.spyOn(carriagesFacade, 'load');
    jest.spyOn(routesFacade, 'load');

    component.ngOnInit();

    expect(stationsFacade.load).toHaveBeenCalled();
    expect(carriagesFacade.load).toHaveBeenCalled();
    expect(routesFacade.load).toHaveBeenCalled();
  });

  it('should toggle the form for creating a new route', () => {
    component.createRouteClick();
    expect(component.formToggle).toBeTruthy();
    expect(component.formRoute).toBeUndefined();
  });

  it('should toggle the form for editing an existing route', () => {
    const mockRoute = MockRoutesData.routes[0];
    component.editRouteClick(mockRoute);

    expect(component.formToggle).toBeTruthy();
    expect(component.formRoute).toEqual(mockRoute);
  });

  it('should close the form when closeForm is called', () => {
    component.formToggle = true;
    component.formRoute = MockRoutesData.routes[0];

    component.closeForm();

    expect(component.formToggle).toBeFalsy();
    expect(component.formRoute).toBeUndefined();
  });

  it('should update displayed routes on page change', () => {
    const mockRoutes = MockRoutesData.routes;

    // @ts-expect-error to set private property
    component.allRoutes = mockRoutes;
    component.onPageChange({ first: 0, rows: 2 });

    expect(component.pageRoutes.length).toBe(2);
    expect(component.pageRoutes[0].id).toBe(1);
    expect(component.pageRoutes[1].id).toBe(2);
  });

  it('should handle route deletion correctly', () => {
    const mockRoute = MockRoutesData.routes[0];
    component.formRoute = mockRoute;

    component.deleteRoute(mockRoute);

    expect(component.formToggle).toBeFalsy();
    expect(component.formRoute).toBeUndefined();
  });

  it('should show loading spinner when no routes are available', () => {
    component.totalRoutes = 0;
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('p-progressSpinner');
    expect(spinner).toBeTruthy();
  });

  it('should hide loading spinner when routes are available', () => {
    component.totalRoutes = 10;
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('p-progressSpinner');
    expect(spinner).toBeNull();
  });
});
