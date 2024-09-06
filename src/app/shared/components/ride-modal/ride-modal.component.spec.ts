import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideModalComponent } from './ride-modal.component';

describe('ModalContentComponent', () => {
  let component: RideModalComponent;
  let fixture: ComponentFixture<RideModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RideModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RideModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
