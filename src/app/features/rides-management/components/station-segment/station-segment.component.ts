import { TStationSegmentData } from '@/core/models/rides.model';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-station-segment',
  standalone: true,
  imports: [CommonModule, ButtonModule, CalendarModule, ReactiveFormsModule],
  templateUrl: './station-segment.component.html',
  styleUrl: './station-segment.component.scss',
})
export class StationSegmentComponent implements OnChanges {
  @Input() segmentData!: TStationSegmentData;

  @Output() dateChange = new EventEmitter<
    Omit<TStationSegmentData, 'name' | 'id'>
  >();

  private fb = inject(FormBuilder);

  public editMode = false;

  public dateForm = this.fb.group({
    arrival: this.fb.control<Date | null>(null, Validators.required),
    departure: this.fb.control<Date | null>(null, Validators.required),
  });

  get arrival() {
    return this.dateForm.controls.arrival;
  }

  get departure() {
    return this.dateForm.controls.departure;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['segmentData']) {
      this.setInitialDate('arrival');
      this.setInitialDate('departure');
    }
  }

  private setInitialDate(type: 'arrival' | 'departure') {
    const segment = this.segmentData[type];
    if (segment && segment.time) {
      const date = this.fromISOString(segment.time);
      this.dateForm.controls[type].setValue(date);
    }
  }

  public editClick() {
    this.editMode = true;
  }

  public saveClick() {
    if (this.isFormInvalid()) {
      return;
    }

    const dateData = this.constructDateData();
    if (dateData.arrival || dateData.departure) {
      this.dateChange.emit(dateData);
      this.setInitialDate('arrival');
      this.setInitialDate('departure');
    }
    this.editMode = false;
  }

  private isFormInvalid(): boolean {
    if (
      this.segmentData.arrival === undefined ||
      this.segmentData.departure === undefined
    ) {
      if (
        (this.segmentData.arrival === undefined && this.departure.invalid) ||
        (this.segmentData.departure === undefined && this.arrival.invalid)
      ) {
        return true;
      }
    } else if (this.dateForm.invalid) {
      return true;
    }
    return false;
  }

  private constructDateData(): Omit<TStationSegmentData, 'name' | 'id'> {
    const dateData: Omit<TStationSegmentData, 'name' | 'id'> = {
      arrival: this.updatedSegment('arrival'),
      departure: this.updatedSegment('departure'),
    };
    return dateData;
  }

  private updatedSegment(type: 'arrival' | 'departure') {
    const segment = this.segmentData[type];
    const control = this.dateForm.controls[type];
    const dateValue = control.value;

    if (segment && dateValue !== null) {
      return {
        ...segment,
        time: this.toLocalISODateString(dateValue),
      };
    }
    return undefined;
  }

  private fromISOString(isoString: string): Date {
    const date = new Date(isoString);

    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();

    return new Date(year, month, day, hours, minutes, seconds);
  }

  private toLocalISODateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:00.000Z`;
  }
}
