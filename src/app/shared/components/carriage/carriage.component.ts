import { CarriageMap } from '@/core/models/carriages.model';
import {
  OccupiedSeat,
  SeatEventData,
  SelectedSeat,
} from '@/core/models/trip.model';
import { getSeatIndex } from '@/shared/utils/seatIndex';
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

  @Input() occupiedSeats: number[] = [];

  @Input() carNumber: number = 0;

  @Input() carriageMap: CarriageMap | null = null;

  @Input() carriages: string[] = [];

  @Input() selectedSeat: SelectedSeat | null = null;

  @Input() occupiedSeat: OccupiedSeat | null = null;

  @Output() seatChange = new EventEmitter<SeatEventData>();

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

  public chooseSeat(seat: number) {
    if (!this.carriageMap) {
      return;
    }
    const seatIndex = getSeatIndex(
      this.carNumber,
      seat,
      this.carriages,
      this.carriageMap,
    );

    this.seatChange.emit({ seat, carNumber: this.carNumber, seatIndex });
  }

  public isOccupied(seat: number) {
    if (!this.carriageMap) return false;

    if (
      this.occupiedSeat?.seat === seat &&
      this.occupiedSeat.carNumber === this.carNumber
    ) {
      return true;
    }

    const index = getSeatIndex(
      this.carNumber,
      seat,
      this.carriages,
      this.carriageMap,
    );

    return this.occupiedSeats.includes(index);
  }

  public isSelected(seat: number): boolean {
    return (
      this.selectedSeat?.seat === seat &&
      this.selectedSeat.carNumber === this.carNumber
    );
  }
}
