import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService } from 'primeng/api';
import { NotificationService } from '@/shared/services/notification.service';
import {
  MockNotificationService,
  MockOrdersFacade,
  MockOrdersState,
} from '@/testing/mocks';
import { OrdersFacadeService } from '../../services/facade/orders-facade.service';

import { OrderItemComponent } from './order-item.component';

describe('OrderItemComponent', () => {
  let component: OrderItemComponent;
  let fixture: ComponentFixture<OrderItemComponent>;
  let confirmationService: ConfirmationService;
  let ordersFacade: MockOrdersFacade;
  let notificationService: MockNotificationService;

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

    confirmationService = TestBed.inject(ConfirmationService);
    ordersFacade = TestBed.inject(
      OrdersFacadeService,
    ) as unknown as MockOrdersFacade;
    notificationService = TestBed.inject(
      NotificationService,
    ) as unknown as MockNotificationService;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update tagSeverity based on order status', () => {
    component.order.status = 'completed';
    component.ngOnChanges();
    expect(component.tagSeverity).toBe('success');
  });

  it('should display order details correctly', () => {
    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('.city').textContent).toContain('testStart');
    expect(compiled.querySelector('.total-data').textContent).toContain('test');
  });

  it('should display cancel button for active orders', () => {
    const cancelButton = fixture.nativeElement.querySelector('.cancel-btn');
    expect(cancelButton).toBeTruthy();
  });

  it('should not display cancel button for non-active orders', () => {
    component.order.status = 'completed';
    fixture.detectChanges();
    const cancelButton = fixture.nativeElement.querySelector('.cancel-btn');
    expect(cancelButton).toBeNull();
  });

  it('should call ConfirmationService when cancel button is clicked', () => {
    const spy = jest.spyOn(confirmationService, 'confirm');

    const button = fixture.nativeElement.querySelector('.cancel-btn button');
    button.click();

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('Do you want to cancel this order?'),
        header: 'Cancel Confirmation',
      }),
    );
  });

  it('should show success notification on order cancel success', () => {
    const notificationSpy = jest.spyOn(notificationService, 'messageSuccess');
    const confirmSpy = jest.spyOn(confirmationService, 'confirm');

    component.cancel(new Event('click'));

    const confirmationArgs = confirmSpy.mock.calls[0][0];
    if (confirmationArgs.accept) {
      confirmationArgs.accept();
    }

    ordersFacade.setState(MockOrdersState.successState);

    expect(notificationSpy).toHaveBeenCalledWith('Order canceled');
  });

  it('should show error notification on order cancel failure', () => {
    const notificationSpy = jest.spyOn(notificationService, 'messageError');
    const confirmSpy = jest.spyOn(confirmationService, 'confirm');

    component.cancel(new Event('click'));

    const confirmationArgs = confirmSpy.mock.calls[0][0];
    if (confirmationArgs.accept) {
      confirmationArgs.accept();
    }

    ordersFacade.setState(MockOrdersState.errorState);

    expect(notificationSpy).toHaveBeenCalledWith('Some error');
  });
});
