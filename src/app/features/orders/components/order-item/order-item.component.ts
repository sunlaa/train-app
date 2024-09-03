import { Component, inject, Input, OnChanges } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DurationPipe } from '@/features/search-tickets/pipes/duration.pipe';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { NotificationService } from '@/shared/services/notification.service';
import { Order, TTagSeverity } from '@/core/models/orders.model';
import handleOrderData from '../../utils/handleOrderData';
import { OrdersFacadeService } from '../../services/facade/orders-facade.service';

const severeties: Record<Order['status'], TTagSeverity> = {
  active: 'info',
  completed: 'success',
  canceled: 'danger',
  rejected: 'warning',
};
@Component({
  selector: 'app-order-item',
  standalone: true,
  imports: [
    CardModule,
    CommonModule,
    TagModule,
    DurationPipe,
    ButtonModule,
    DividerModule,
  ],
  templateUrl: './order-item.component.html',
  styleUrl: './order-item.component.scss',
})
export class OrderItemComponent implements OnChanges {
  @Input({ required: true }) order!: ReturnType<typeof handleOrderData>;

  @Input() isAdmin: boolean | undefined;

  private ordersFacade = inject(OrdersFacadeService);

  private confirmationService = inject(ConfirmationService);

  private notificationService = inject(NotificationService);

  public tagSeverity!: TTagSeverity;

  ngOnChanges(): void {
    this.tagSeverity = severeties[this.order.status];
  }

  public cancel(event: Event) {
    const message = this.order.owner
      ? `<p>ID: ${this.order.orderId}</p><p>Owner: ${this.order.owner}</p><p>Do you want to cancel this order?</p>`
      : 'Do you want to cancel this order?';
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message,
      header: 'Cancel Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        this.ordersFacade.cancelOrder(this.order.orderId).subscribe((err) => {
          if (!err) {
            this.notificationService.messageSuccess('Order canceled');
          } else {
            this.notificationService.messageError(err.message);
          }
        });
      },
    });
  }
}
