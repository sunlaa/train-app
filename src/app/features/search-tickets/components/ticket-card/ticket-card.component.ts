import { Ticket } from '@/core/models/search.model';
import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DuarationPipe } from '../../pipes/duration.pipe';

@Component({
  selector: 'app-ticket-card',
  standalone: true,
  imports: [
    DatePipe,
    DuarationPipe,
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

  modalVisible: boolean = false;

  showRoute() {
    this.modalVisible = true;
  }
}
