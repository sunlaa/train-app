import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private messageService = inject(MessageService);

  public messageSuccess(message: string | undefined) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
    });
  }

  public messageError(message: string | undefined) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }

  public messageConfirm(message: string | undefined) {
    this.messageService.add({
      severity: 'info',
      summary: 'Confirmed',
      detail: message,
    });
  }
}
