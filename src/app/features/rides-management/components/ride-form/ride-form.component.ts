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
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';
import {
  Entry,
  TRidePrice,
  TRideSegment,
  TRouteRide,
} from '@/core/models/rides.model';
import { map, startWith, takeUntil } from 'rxjs';
import { DestroyService } from '@/core/services/destroy/destroy.service';
import { CommonModule } from '@angular/common';
import toLocalISODateString from '../../utils/toLocalISODateString';

@Component({
  selector: 'app-ride-form',
  standalone: true,
  imports: [
    ButtonModule,
    CalendarModule,
    InputNumberModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  providers: [DestroyService],
  templateUrl: './ride-form.component.html',
  styleUrl: './ride-form.component.scss',
})
export class RideFormComponent implements OnChanges {
  @Input({ required: true }) stations!: Entry<number>[];

  @Input({ required: true }) carriages!: Entry<string>[];

  @Output() createRide = new EventEmitter<Omit<TRouteRide, 'rideId'>>();

  @Output() closeForm = new EventEmitter<void>();

  private destroy$ = inject(DestroyService);

  private messageService = inject(MessageService);

  private fb = inject(FormBuilder);

  public rideForm = this.fb.group({
    dates: this.fb.array<Date | null>([]),
    prices: this.fb.array<number | null>([]),
  });

  public buttonIsDisabled$ = this.rideForm.valueChanges.pipe(
    startWith(null),
    takeUntil(this.destroy$),
    map(() => this.rideForm.invalid),
  );

  get dates() {
    return this.rideForm.controls.dates;
  }

  get prices() {
    return this.rideForm.controls.prices;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stations'] || changes['carriages']) {
      this.updateInputs();
    }
  }

  private updateInputs() {
    this.dates.clear();
    this.prices.clear();
    const stationsLength = this.stations.length;
    const carriagesLength = this.carriages.length;
    for (let i = 0; i < stationsLength - 1; i += 1) {
      this.dates.push(this.fb.control(null, Validators.required));
      this.dates.push(this.fb.control(null, Validators.required));
      for (let j = 0; j < carriagesLength; j += 1) {
        this.prices.push(this.fb.control(null, Validators.required));
      }
    }
  }

  private messageError(message: string | undefined) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }

  public closeFormClick() {
    this.closeForm.emit();
    this.resetForm();
  }

  private resetForm() {
    this.rideForm.reset();
    this.dates.clear();
    this.prices.clear();
  }

  public onSubmit() {
    if (!this.rideForm.valid) {
      this.messageError('Fill out all fields');
      return;
    }
    const dates = this.dates.controls.map((ctrl) => ctrl.value) as Date[];
    const packedDates: [string, string][] = this.packDates(dates);
    const prices = this.prices.controls.map((ctrl) => ctrl.value) as number[];
    const packedPrices: TRidePrice[] = this.packPrices(prices);
    if (packedDates.length !== packedPrices.length) {
      this.messageError('Something went wrong...');
      return;
    }
    const segments: TRideSegment[] = packedDates.map((time, i) => ({
      time,
      price: packedPrices[i],
    }));
    this.createRide.emit({ segments });
    this.closeForm.emit();
    this.resetForm();
  }

  private packDates(dates: Date[]) {
    const packedDates: [string, string][] = [];
    for (let i = 0; i < dates.length; i += 2) {
      const departure = toLocalISODateString(dates[i]);
      const arrival = toLocalISODateString(dates[i + 1]);
      const dateSegment: [string, string] = [departure, arrival];
      packedDates.push(dateSegment);
    }
    return packedDates;
  }

  private packPrices(prices: number[]) {
    const packedPrices: TRidePrice[] = [];
    for (let i = 0; i < prices.length; i += this.carriages.length) {
      const priceSegment: TRidePrice = {};
      this.carriages.forEach((carriage, j) => {
        priceSegment[carriage.id] = prices[i + j];
      });
      packedPrices.push(priceSegment);
    }
    return packedPrices;
  }
}
