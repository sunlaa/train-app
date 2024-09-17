import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TStationSegmentData } from '@/core/models/rides.model';
import { By } from '@angular/platform-browser';
import { StationSegmentComponent } from './station-segment.component';
import dateFromISOString from '../../utils/dateFromISOString';

describe('StationSegmentComponent', () => {
  let component: StationSegmentComponent;
  let fixture: ComponentFixture<StationSegmentComponent>;

  const mockSegmentData: TStationSegmentData = {
    id: 1,
    name: 'Station 1',
    arrival: { index: 0, time: '2024-09-08T10:00:00Z' },
    departure: { index: 1, time: '2024-09-08T12:00:00Z' },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StationSegmentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StationSegmentComponent);
    component = fixture.componentInstance;
    component.segmentData = mockSegmentData;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with segment data', () => {
    component.ngOnChanges({
      segmentData: {
        previousValue: null,
        currentValue: mockSegmentData,
        firstChange: true,
        isFirstChange: () => true,
      },
    });
    fixture.detectChanges();

    const arrivalControl = component.dateForm.controls.arrival;
    const expectedArrivalDate = dateFromISOString(
      mockSegmentData.arrival!.time,
    );
    const departureControl = component.dateForm.controls.departure;
    const expectedDepartureDate = dateFromISOString(
      mockSegmentData.departure!.time,
    );

    expect(arrivalControl.value).toEqual(expectedArrivalDate);
    expect(departureControl.value).toEqual(expectedDepartureDate);
  });

  it('should toggle edit mode when edit button is clicked', () => {
    fixture.detectChanges();

    const editButton = fixture.debugElement.query(
      By.css('.edit-btn button'),
    ).nativeElement;
    editButton.click();
    fixture.detectChanges();

    expect(component.editMode).toBe(true);
  });

  it('should save changes and emit dateChange when save button is clicked', () => {
    const dateChangeSpy = jest.spyOn(component.dateChange, 'emit');
    component.ngOnChanges({
      segmentData: {
        previousValue: null,
        currentValue: mockSegmentData,
        firstChange: true,
        isFirstChange: () => true,
      },
    });
    fixture.detectChanges();

    const editButton = fixture.debugElement.query(
      By.css('.edit-btn button'),
    ).nativeElement;
    editButton.click();
    fixture.detectChanges();

    component.arrival.setValue(dateFromISOString('2024-09-08T11:00:00Z'));

    const saveButton = fixture.debugElement.query(
      By.css('.edit-btn button'),
    ).nativeElement;
    saveButton.click();
    fixture.detectChanges();

    expect(dateChangeSpy).toHaveBeenCalledWith({
      arrival: { index: 0, time: '2024-09-08T11:00:00.000Z' },
      departure: { index: 1, time: '2024-09-08T12:00:00.000Z' },
    });
    expect(component.editMode).toBe(false);
  });

  it('should not emit dateChange if form is invalid', () => {
    const dateChangeSpy = jest.spyOn(component.dateChange, 'emit');
    component.segmentData = { ...mockSegmentData, arrival: undefined };
    fixture.detectChanges();

    const editButton = fixture.debugElement.query(
      By.css('.edit-btn button'),
    ).nativeElement;
    editButton.click();
    fixture.detectChanges();

    const saveButton = fixture.debugElement.query(
      By.css('.edit-btn button'),
    ).nativeElement;
    saveButton.click();
    fixture.detectChanges();

    expect(dateChangeSpy).not.toHaveBeenCalled();
  });
});
