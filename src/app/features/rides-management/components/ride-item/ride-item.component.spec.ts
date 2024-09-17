import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService } from 'primeng/api';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MockRidesData } from '@/testing/mocks/rides';
import { RideItemComponent } from './ride-item.component';

describe('RideItemComponent', () => {
  let component: RideItemComponent;
  let fixture: ComponentFixture<RideItemComponent>;
  let confirmationService: ConfirmationService;

  const mockRide = MockRidesData.routeRides.schedule[0];

  const mockStations = [
    { id: 1, name: 'Station 1' },
    { id: 2, name: 'Station 2' },
  ];

  const mockCarriages = [{ id: 'A1', name: 'Carriage A' }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RideItemComponent, NoopAnimationsModule],
      providers: [ConfirmationService],
    }).compileComponents();

    fixture = TestBed.createComponent(RideItemComponent);
    component = fixture.componentInstance;
    confirmationService = TestBed.inject(ConfirmationService);

    component.ride = mockRide;
    component.stations = mockStations;
    component.carriages = mockCarriages;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize station segments on changes', () => {
    component.ngOnChanges({
      ride: {
        previousValue: null,
        currentValue: mockRide,
        firstChange: true,
        isFirstChange: () => true,
      },
      stations: {
        previousValue: null,
        currentValue: mockStations,
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    expect(component.stationSegments.length).toEqual(2);
    expect(component.stationSegments[0].name).toEqual('Station 1');
    expect(component.stationSegments[1].name).toEqual('Station 2');
  });

  it('should emit rideDelete when delete button is clicked', () => {
    const confirmSpy = jest.spyOn(confirmationService, 'confirm');
    const rideDeleteSpy = jest.spyOn(component.rideDelete, 'emit');

    component.deleteClick(new Event('click'));

    const confirmationArgs = confirmSpy.mock.calls[0][0];
    if (confirmationArgs.accept) {
      confirmationArgs.accept();
    }

    expect(rideDeleteSpy).toHaveBeenCalledWith(1);
  });

  it('should emit rideChange when date is changed', () => {
    const rideChangeSpy = jest.spyOn(component.rideChange, 'emit');

    const newDate = {
      departure: { time: '2024-09-08T13:00:00Z', index: 0 },
      arrival: undefined,
    };
    component.dateChangeEvent(newDate);

    const expectedRide = { ...mockRide };
    expectedRide.segments[0].time = [
      '2024-09-08T13:00:00Z',
      '2024-09-01T10:00:00Z',
    ];

    expect(rideChangeSpy).toHaveBeenCalledWith(mockRide);
  });

  it('should emit rideChange when price is changed', () => {
    const rideChangeSpy = jest.spyOn(component.rideChange, 'emit');

    const newPrice = { price: { A1: 150 }, index: 0 };
    component.priceChangeEvent(newPrice);

    const expectedRide = { ...mockRide };

    expectedRide.segments[0].price = {
      A1: 150,
    };

    expect(rideChangeSpy).toHaveBeenCalledWith(expectedRide);
  });
});
