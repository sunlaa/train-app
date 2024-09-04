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
import toLocalISODateString from '../../utils/toLocalISODateString';
import dateFromISOString from '../../utils/dateFromISOString';

@Component({
  selector: 'app-station-segment',
  standalone: true,
  imports: [CommonModule, ButtonModule, CalendarModule, ReactiveFormsModule],
  templateUrl: './station-segment.component.html',
  styleUrl: './station-segment.component.scss',
})
export class StationSegmentComponent implements OnChanges {
  @Input() segmentData!: TStationSegmentData;

  @Input() isLast!: boolean;

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
      const date = dateFromISOString(segment.time);
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
        time: toLocalISODateString(dateValue),
      };
    }
    return undefined;
  }
}
