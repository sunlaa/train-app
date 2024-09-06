import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService } from 'primeng/api';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { RideItemComponent } from './ride-item.component';

describe('RideItemComponent', () => {
  let component: RideItemComponent;
  let fixture: ComponentFixture<RideItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RideItemComponent, NoopAnimationsModule],
      providers: [ConfirmationService],
    }).compileComponents();

    fixture = TestBed.createComponent(RideItemComponent);
    component = fixture.componentInstance;

    component.ride = { rideId: 0, segments: [] };
    component.stationSegments = [];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
