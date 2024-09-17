import { Ticket } from '@/core/models/search.model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DurationPipe } from '../../../../shared/pipes/duration.pipe';
import { RideModalComponent } from '../../../../shared/components/ride-modal/ride-modal.component';

@Component({
  selector: 'app-ticket-card',
  standalone: true,
  imports: [
    RideModalComponent,
    DatePipe,
    CurrencyPipe,
    DurationPipe,
    CardModule,
    DividerModule,
    ChipModule,
    ButtonModule,
    DialogModule,
    RouterLink,
  ],
  templateUrl: './ticket-card.component.html',
  styleUrl: './ticket-card.component.scss',
})
export class TicketCardComponent {
  @Input({ required: true }) ticket!: Ticket;

  private router = inject(Router);

  public modalVisible: boolean = false;

  public showRoute(event: Event) {
    event.stopPropagation();
    this.modalVisible = true;
  }

  toTrip() {
    this.router.navigate(['/trip', this.ticket.rideId], {
      queryParams: { from: this.ticket.fromId, to: this.ticket.toId },
    });
  }
}
