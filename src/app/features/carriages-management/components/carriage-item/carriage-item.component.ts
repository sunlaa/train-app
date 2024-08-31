import { NotificationService } from '@/shared/services/notification.service';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';
import { TCarriage } from '@/core/models/carriages.model';
import { CarriagesFacadeService } from '../../services/carriages-facade.service';
import { CarriageComponent } from '../../../../shared/components/carriage/carriage.component';

@Component({
  selector: 'app-carriage-item',
  standalone: true,
  imports: [PanelModule, TooltipModule, ConfirmDialogModule, CarriageComponent],
  providers: [],
  templateUrl: './carriage-item.component.html',
  styleUrl: './carriage-item.component.scss',
})
export class CarriageItemComponent {
  @Input({ required: true }) carriage!: TCarriage;

  @Output() editCarriageClick = new EventEmitter<TCarriage>();

  @Output() deleteCarriage = new EventEmitter<TCarriage>();

  private notificationService = inject(NotificationService);

  private confirmationService = inject(ConfirmationService);

  private carriagesFacade = inject(CarriagesFacadeService);

  get name() {
    return this.carriage.name;
  }

  get rows() {
    return this.carriage.rows;
  }

  get leftSeats() {
    return this.carriage.leftSeats;
  }

  get rightSeats() {
    return this.carriage.rightSeats;
  }

  public editClick() {
    this.editCarriageClick.emit(this.carriage);
  }

  public deleteClick(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this carriage?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        const request$ = this.carriagesFacade.delete(this.carriage.code);
        request$.subscribe({
          next: ({ status, error }) => {
            if (status === 'success') {
              this.deleteCarriage.emit(this.carriage);
              this.notificationService.messageSuccess('Carriage deleted');
            } else {
              this.notificationService.messageError(error?.message);
            }
          },
        });
      },
    });
  }
}
