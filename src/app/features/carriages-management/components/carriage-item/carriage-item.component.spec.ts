import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationService } from '@/shared/services/notification.service';
import { ConfirmationService } from 'primeng/api';
import { provideMockStore } from '@ngrx/store/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockNotificationService } from '@/testing/mocks';

import { CarriageItemComponent } from './carriage-item.component';

describe('CarriageItemComponent', () => {
  let component: CarriageItemComponent;
  let fixture: ComponentFixture<CarriageItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarriageItemComponent, NoopAnimationsModule],
      providers: [
        { provide: NotificationService, useClass: MockNotificationService },
        ConfirmationService,
        provideMockStore({}),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CarriageItemComponent);
    component = fixture.componentInstance;
    component.carriage = {
      code: 'test',
      name: 'test',
      rows: 10,
      rightSeats: 2,
      leftSeats: 2,
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
