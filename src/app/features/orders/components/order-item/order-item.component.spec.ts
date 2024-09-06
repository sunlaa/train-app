import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService } from 'primeng/api';
import { NotificationService } from '@/shared/services/notification.service';
import { MockNotificationService, MockOrdersFacade } from '@/testing/mocks';
import { OrdersFacadeService } from '../../services/facade/orders-facade.service';

import { OrderItemComponent } from './order-item.component';

describe('OrderItemComponent', () => {
  let component: OrderItemComponent;
  let fixture: ComponentFixture<OrderItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderItemComponent],
      providers: [
        { provide: OrdersFacadeService, useClass: MockOrdersFacade },
        { provide: NotificationService, useClass: MockNotificationService },
        ConfirmationService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderItemComponent);
    component = fixture.componentInstance;
    component.order = {
      orderId: 1,
      startCity: 'testStart',
      endCity: 'testEnd',
      startTripTime: 0,
      endTripTime: 0,
      tripDuration: 0,
      carriageType: 'test',
      carNumber: 1,
      seatNumber: 1,
      price: 1,
      owner: 'Test',
      status: 'active',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
