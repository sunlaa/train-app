import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TPriceSegmentData } from '@/core/models/rides.model';
import { By } from '@angular/platform-browser';
import { PriceSegmentComponent } from './price-segment.component';

describe('PriceSegmentComponent', () => {
  let component: PriceSegmentComponent;
  let fixture: ComponentFixture<PriceSegmentComponent>;

  const mockSegmentData: TPriceSegmentData = {
    index: 0,
    carriages: [
      { id: 'C1', name: 'Economy' },
      { id: 'C2', name: 'Business' },
    ],
    price: {
      C1: 50,
      C2: 100,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceSegmentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PriceSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form when segmentData is provided', () => {
    component.segmentData = mockSegmentData;
    component.ngOnChanges({
      segmentData: {
        previousValue: null,
        currentValue: mockSegmentData,
        firstChange: true,
        isFirstChange: () => true,
      },
    });
    fixture.detectChanges();

    const priceInputs = component.priceForm.controls.prices;
    expect(priceInputs.length).toBe(2);
    expect(priceInputs.controls[0].value).toBe(50);
    expect(priceInputs.controls[1].value).toBe(100);
  });

  it('should switch to edit mode when edit button is clicked', () => {
    component.segmentData = mockSegmentData;
    fixture.detectChanges();

    const editButton = fixture.debugElement.query(
      By.css('.heading button'),
    ).nativeElement;
    editButton.click();

    expect(component.editMode).toBe(true);
  });

  it('should save changes and emit priceChange when save button is clicked', () => {
    const priceChangeSpy = jest.spyOn(component.priceChange, 'emit');
    component.segmentData = mockSegmentData;
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
      By.css('.heading button'),
    ).nativeElement;
    editButton.click();
    fixture.detectChanges();

    component.prices.controls[0].setValue(60);

    const saveButton = fixture.debugElement.query(
      By.css('.heading button'),
    ).nativeElement;
    saveButton.click();
    fixture.detectChanges();

    expect(priceChangeSpy).toHaveBeenCalled();
    expect(priceChangeSpy).toHaveBeenCalledWith({
      price: { C1: 60, C2: 100 },
      index: mockSegmentData.index,
    });
    expect(component.editMode).toBe(false);
  });

  it('should not emit priceChange if values are unchanged', () => {
    const priceChangeSpy = jest.spyOn(component.priceChange, 'emit');
    component.segmentData = mockSegmentData;
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
      By.css('.heading button'),
    ).nativeElement;
    editButton.click();
    fixture.detectChanges();

    const saveButton = fixture.debugElement.query(
      By.css('.heading button'),
    ).nativeElement;
    saveButton.click();
    fixture.detectChanges();

    expect(priceChangeSpy).not.toHaveBeenCalled();
  });
});
