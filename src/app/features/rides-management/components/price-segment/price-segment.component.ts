import {
  TCarriagePrice,
  TPriceSegmentData,
  TRidePrice,
} from '@/core/models/rides.model';
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
import {
  ReactiveFormsModule,
  FormBuilder,
  FormArray,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-price-segment',
  standalone: true,
  imports: [CommonModule, ButtonModule, InputNumberModule, ReactiveFormsModule],
  templateUrl: './price-segment.component.html',
  styleUrl: './price-segment.component.scss',
})
export class PriceSegmentComponent implements OnChanges {
  @Input() segmentData: TPriceSegmentData | undefined;

  @Output() priceChange = new EventEmitter<
    Omit<TPriceSegmentData, 'carriages'>
  >();

  private fb = inject(FormBuilder);

  public carriagePrices: TCarriagePrice[] = [];

  public editMode = false;

  public priceForm = this.fb.group({
    prices: this.fb.array([]),
  });

  ngOnChanges(changes: SimpleChanges): void {
    const { previousValue: prev, currentValue: curr } = changes['segmentData'];
    // Deep check due to default's incorrect detection
    const carriagesDiffers = prev?.carriages !== curr?.carriages;
    const priceDiffers = prev?.price !== curr?.price;
    const indexDiffers = prev?.index !== curr?.index;
    const segmentChanged = carriagesDiffers || priceDiffers || indexDiffers;
    if (segmentChanged && this.segmentData) {
      this.initializeForm();
    }
  }

  private initializeForm() {
    this.prices.clear();
    if (this.segmentData) {
      this.carriagePrices = this.segmentData.carriages.map((carriage) => {
        const price = this.segmentData!.price[carriage];
        this.prices.push(this.fb.control(price, Validators.required));
        return { carriage, price };
      });
    }
  }

  get prices(): FormArray {
    return this.priceForm.controls.prices;
  }

  public editClick() {
    this.editMode = true;
  }

  public saveClick() {
    if (!this.priceForm.valid) {
      return;
    }
    const valuesDiffers = this.prices.controls.some(
      (ctrl, i) => ctrl.value !== this.carriagePrices[i].price,
    );
    if (valuesDiffers && this.segmentData) {
      const prices: TRidePrice = {};
      this.prices.controls.forEach((ctrl, i) => {
        const { carriage } = this.carriagePrices[i];
        prices[carriage] = ctrl.value;
      });
      this.priceChange.emit({ price: prices, index: this.segmentData.index });
    }
    this.editMode = false;
  }
}
