import { Ticket } from '@/core/models/search.model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DurationPipe } from '../../pipes/duration.pipe';
import { ModalContentComponent } from '../modal-content/modal-content.component';

@Component({
  selector: 'app-ticket-card',
  standalone: true,
  imports: [
    ModalContentComponent,
    DatePipe,
    CurrencyPipe,
    DurationPipe,
    CardModule,
    DividerModule,
    ChipModule,
    ButtonModule,
    DialogModule,
  ],
  templateUrl: './ticket-card.component.html',
  styleUrl: './ticket-card.component.scss',
})
export class TicketCardComponent {
  @Input({ required: true }) ticket!: Ticket;

  public modalVisible: boolean = false;

  public showRoute() {
    this.modalVisible = true;
  }
}
