import { Component, inject, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DurationPipe } from '@/features/search-tickets/pipes/duration.pipe';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { NotificationService } from '@/shared/services/notification.service';
import handleOrderData from '../../utils/handleOrderData';
import { OrdersFacadeService } from '../../services/facade/orders-facade.service';

@Component({
  selector: 'app-order-item',
  standalone: true,
  imports: [CardModule, CommonModule, TagModule, DurationPipe, ButtonModule],
  templateUrl: './order-item.component.html',
  styleUrl: './order-item.component.scss',
})
export class OrderItemComponent {
  @Input({ required: true }) order!: ReturnType<typeof handleOrderData>;

  @Input() managerView: boolean | undefined;

  private ordersFacade = inject(OrdersFacadeService);

  private confirmationService = inject(ConfirmationService);

  private notificationService = inject(NotificationService);

  get tagSeverity() {
    switch (this.order.status) {
      case 'active':
        return 'info';
      case 'completed':
        return 'success';
      case 'canceled':
        return 'danger';
      case 'rejected':
        return 'warning';
      default:
        return 'contrast';
    }
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
