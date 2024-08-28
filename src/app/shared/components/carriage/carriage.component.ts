import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-carriage',
  standalone: true,
  imports: [],
  templateUrl: './carriage.component.html',
  styleUrl: './carriage.component.scss',
})
export class CarriageComponent implements OnInit, OnChanges {
  @Input() rows: number = 0;

  @Input() leftSeats: number = 0;

  @Input() rightSeats: number = 0;

  @Input() firstSeatNumber: number = 1;

  leftSeatRows: number[][] = [];

  rightSeatRows: number[][] = [];

  ngOnChanges(): void {
    this.generateSeatNumbers();
  }

  ngOnInit() {
    this.generateSeatNumbers();
  }

  generateSeatNumbers() {
    let seatNumber = this.firstSeatNumber;

    const leftSeatRows: number[][] = [];
    const rightSeatRows: number[][] = [];

    for (let row = 0; row < this.rows; row += 1) {
      const leftRow: number[] = [];
      const rightRow: number[] = [];

      for (let i = 0; i < this.leftSeats; i += 1) {
        leftRow.push(seatNumber);
        seatNumber += 1;
      }

      for (let i = 0; i < this.rightSeats; i += 1) {
        rightRow.push(seatNumber);
        seatNumber += 1;
      }

      leftSeatRows.push(leftRow);
      rightSeatRows.push(rightRow);
    }

    this.leftSeatRows = leftSeatRows;
    this.rightSeatRows = rightSeatRows;
  }
}
