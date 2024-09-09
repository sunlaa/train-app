import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationService } from '@/shared/services/notification.service';
import { MockNotificationService } from '@/testing/mocks';
import { RideFormComponent } from './ride-form.component';
import dateFromISOString from '../../utils/dateFromISOString';

describe('RideFormComponent', () => {
  let component: RideFormComponent;
  let fixture: ComponentFixture<RideFormComponent>;
  let notificationService: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RideFormComponent],
      providers: [
        { provide: NotificationService, useClass: MockNotificationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RideFormComponent);
    component = fixture.componentInstance;
    component.stations = [
      { id: 1, name: 'Station 1' },
      { id: 2, name: 'Station 2' },
      { id: 3, name: 'Station 3' },
    ];
    component.carriages = [{ id: 'A1', name: 'Carriage A' }];
    notificationService = TestBed.inject(NotificationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form controls based on inputs', () => {
    component.ngOnChanges({
      stations: {
        currentValue: component.stations,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true,
      },
      carriages: {
        currentValue: component.carriages,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    fixture.detectChanges();

    expect(component.dates.length).toBe(4); // 1 stations * 2 (arrival & departure) + 2 (first & last station)
    expect(component.prices.length).toBe(2); // 2 segments * 1 carriage
  });

  it('should emit createRide and closeForm on submit with valid data', () => {
    const createRideSpy = jest.spyOn(component.createRide, 'emit');
    const closeFormSpy = jest.spyOn(component.closeForm, 'emit');

    component.dates.controls[0].setValue(
      dateFromISOString('2024-09-01T10:00:00Z'),
    );
    component.dates.controls[1].setValue(
      dateFromISOString('2024-09-01T12:00:00Z'),
    );
    component.dates.controls[2].setValue(
      dateFromISOString('2024-09-02T12:00:00Z'),
    );
    component.dates.controls[3].setValue(
      dateFromISOString('2024-09-03T12:00:00Z'),
    );
    component.prices.controls[0].setValue(100);
    component.prices.controls[1].setValue(200);

    component.onSubmit();

    const expectedRide = {
      segments: [
        {
          time: ['2024-09-01T10:00:00.000Z', '2024-09-01T12:00:00.000Z'],
          price: { A1: 100 },
        },
        {
          time: ['2024-09-02T12:00:00.000Z', '2024-09-03T12:00:00.000Z'],
          price: { A1: 200 },
        },
      ],
    };

    expect(createRideSpy).toHaveBeenCalledWith(expectedRide);
    expect(closeFormSpy).toHaveBeenCalled();
  });

  it('should display error message if form is invalid on submit', () => {
    const messageErrorSpy = jest.spyOn(notificationService, 'messageError');

    component.onSubmit();

    expect(messageErrorSpy).toHaveBeenCalledWith('Fill out all fields');
  });

  it('should emit closeForm and reset the form on closeFormClick', () => {
    const closeFormSpy = jest.spyOn(component.closeForm, 'emit');
    // @ts-expect-error test
    const resetFormSpy = jest.spyOn(component, 'resetForm');

    component.closeFormClick();

    expect(closeFormSpy).toHaveBeenCalled();
    expect(resetFormSpy).toHaveBeenCalled();
  });
});
