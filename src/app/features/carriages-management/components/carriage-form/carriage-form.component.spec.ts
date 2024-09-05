import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationService } from '@/shared/services/notification.service';
import { provideMockStore } from '@ngrx/store/testing';
import { MockNotificationService } from '@/testing/mocks';

import { CarriageFormComponent } from './carriage-form.component';

describe('CarriageFormComponent', () => {
  let component: CarriageFormComponent;
  let fixture: ComponentFixture<CarriageFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarriageFormComponent],
      providers: [
        { provide: NotificationService, useClass: MockNotificationService },
        provideMockStore({}),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CarriageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
