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
  let routesFacade: MockRoutesFacade;

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

    routesFacade = TestBed.inject(
      RoutesFacadeService,
    ) as unknown as MockRoutesFacade;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty controls when no route is provided', () => {
    expect(component.stations.length).toBe(1); // One empty station added
    expect(component.carriages.length).toBe(1); // One empty carriage added
  });

  it('should populate the form with route data when a route is provided', () => {
    const mockRoute = { id: 1, path: [1], carriages: ['A1'] };
    component.route = mockRoute;
    component.ngOnChanges({
      route: {
        currentValue: mockRoute,
        firstChange: false,
        previousValue: undefined,
        isFirstChange: () => false,
      },
    });
    fixture.detectChanges();

    expect(component.stations.length).toBe(2); // One from route, one empty
    expect(component.carriages.length).toBe(2); // One from route, one empty
  });

  it('should add an empty station when addEmptyStation is called', () => {
    component.addEmptyStation();
    expect(component.stations.length).toBe(2); // One initial station + one empty station
  });

  it('should add an empty carriage when addEmptyCarriage is called', () => {
    component.addEmptyCarriage();
    expect(component.carriages.length).toBe(2); // One initial carriage + one empty carriage
  });

  it('should remove a station when removeStation is called', () => {
    component.addEmptyStation(); // Add another station to remove
    component.removeStation(1);
    expect(component.stations.length).toBe(1); // Should remove the station
  });

  it('should remove a carriage when removeCarriage is called', () => {
    component.addEmptyCarriage(); // Add another carriage to remove
    component.removeCarriage(1);
    expect(component.carriages.length).toBe(1); // Should remove the carriage
  });

  it('should emit closeForm when closeFormClick is called', () => {
    jest.spyOn(component.closeForm, 'emit');
    component.closeFormClick();
    expect(component.closeForm.emit).toHaveBeenCalled();
  });

  it('should disable the submit button when the form is invalid', (done) => {
    component.buttonIsDiabled$.subscribe((isDisabled) => {
      expect(isDisabled).toBe(true);
      done();
    });

    fixture.detectChanges();
  });

  it('should enable the submit button when the form is valid', (done) => {
    component.addEmptyStation();
    component.addEmptyStation();
    component.addEmptyStation(); // Now 4 stations
    component.addEmptyCarriage();
    component.addEmptyCarriage();
    component.addEmptyCarriage(); // Now 4 carriages

    fixture.detectChanges();

    component.buttonIsDiabled$.subscribe((isDisabled) => {
      expect(isDisabled).toBe(false); // The form is valid now
      done();
    });
  });

  it('should call routesFacade.create when onSubmit is called and no route exists', () => {
    jest.spyOn(routesFacade, 'create');

    component.addEmptyStation(0);
    component.addEmptyStation(1);
    component.addEmptyStation(2); // Now 4 stations
    component.addEmptyCarriage(0);
    component.addEmptyCarriage(1);
    component.addEmptyCarriage(2); // Now 4 carriages

    fixture.detectChanges();

    component.onSubmit();
    expect(routesFacade.create).toHaveBeenCalled();
  });

  it('should call routesFacade.update when onSubmit is called and route exists', () => {
    jest.spyOn(routesFacade, 'update');
    component.route = { id: 1, path: [], carriages: [] };

    component.addEmptyStation(0);
    component.addEmptyStation(1);
    component.addEmptyStation(2); // Now 4 stations
    component.addEmptyCarriage(0);
    component.addEmptyCarriage(1);
    component.addEmptyCarriage(2); // Now 4 carriages

    fixture.detectChanges();

    component.onSubmit();
    expect(routesFacade.update).toHaveBeenCalled();
  });
});
