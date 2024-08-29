import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationSegmentComponent } from './station-segment.component';

describe('StationSegmentComponent', () => {
  let component: StationSegmentComponent;
  let fixture: ComponentFixture<StationSegmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StationSegmentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StationSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
