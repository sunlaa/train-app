import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-carriage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carriage.component.html',
  styleUrl: './carriage.component.scss',
})
export class CarriageComponent {
  @Input() rows: number = 0;

  @Input() leftSeats: number = 0;

  @Input() rightSeats: number = 0;

  // @Input() firstSeatNumber: number = 1;

  @Input() occupiedSeats: number[] = [];

  @Output() seatChange = new EventEmitter<number>();

  public seatNumbersForRow(
    row: number,
    seatsOnSide: number,
    isLeftSide: boolean,
  ): number[] {
    const lastNumberedSeats = row * (this.leftSeats + this.rightSeats);
    const firstRowSeatNumber = 1 + lastNumberedSeats;

    const seatOffset = isLeftSide ? 0 : this.leftSeats;

    return Array.from(
      { length: seatsOnSide },
      (_, i) => firstRowSeatNumber + seatOffset + i,
    );
  }

  chooseSeat(seat: number) {
    this.seatChange.emit(seat);
  }
}
