import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceSegmentComponent } from './price-segment.component';

describe('PriceSegmentComponent', () => {
  let component: PriceSegmentComponent;
  let fixture: ComponentFixture<PriceSegmentComponent>;

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
});
