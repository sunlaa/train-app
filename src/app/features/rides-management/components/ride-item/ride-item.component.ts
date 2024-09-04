import {
  Entry,
  TPriceSegmentData,
  TRideSegment,
  TRouteRide,
  TStationSegmentData,
} from '@/core/models/rides.model';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { ConfirmationService } from 'primeng/api';
import { StationSegmentComponent } from '../station-segment/station-segment.component';
import { PriceSegmentComponent } from '../price-segment/price-segment.component';
import dateFromISOString from '../../utils/dateFromISOString';

@Component({
  selector: 'app-ride-item',
  standalone: true,
  imports: [PanelModule, StationSegmentComponent, PriceSegmentComponent],
  templateUrl: './ride-item.component.html',
  styleUrl: './ride-item.component.scss',
})
export class RideItemComponent implements OnChanges {
  @Input({ required: true }) ride!: TRouteRide;

  @Input({ required: true }) stations!: Entry<number>[];

  @Input({ required: true }) carriages!: Entry<string>[];

  @Output() rideChange = new EventEmitter<TRouteRide>();

  @Output() rideDelete = new EventEmitter<number>();

  private confirmationService = inject(ConfirmationService);

  public stationSegments!: TStationSegmentData[];

  public canDelete!: boolean;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.hasRelevantChanges(changes)) {
      this.initializeStationSegments();
    }
  }

  private hasRelevantChanges(changes: SimpleChanges): boolean {
    return ['ride', 'stations', 'carriages'].some((key) => changes[key]);
  }

  private initializeStationSegments() {
    this.stationSegments = this.stations.map((station) => ({
      id: station.id,
      name: station.name,
      departure: undefined,
      arrival: undefined,
    }));

    this.ride.segments.forEach((segment, i) => {
      const [departure, arrival] = segment.time;
      if (this.stationSegments[i]) {
        this.stationSegments[i].departure = {
          time: departure,
          index: i,
        };
      }
      if (this.stationSegments[i + 1]) {
        this.stationSegments[i + 1].arrival = {
          time: arrival,
          index: i,
        };
      }
    });

    if (this.stationSegments && this.stationSegments[0]) {
      const now = new Date();
      const firstDepartureTime = this.stationSegments[0].departure?.time;
      if (firstDepartureTime && now < dateFromISOString(firstDepartureTime)) {
        this.canDelete = true;
      } else {
        this.canDelete = false;
      }
    } else {
      this.canDelete = false;
    }
  }

  get rideId() {
    return this.ride.rideId.toString();
  }

  get segments() {
    const segments: (TStationSegmentData | TPriceSegmentData)[] = [];
    this.stationSegments.forEach((segment, i) => {
      segments.push(segment);
      const rideSegment = this.ride.segments[i];
      if (rideSegment) {
        segments.push(this.createPriceSegmentData(rideSegment, i));
      }
    });
    return segments;
  }

  private createPriceSegmentData(
    rideSegment: TRideSegment,
    index: number,
  ): TPriceSegmentData {
    return {
      carriages: this.carriages,
      price: rideSegment.price,
      index,
    };
  }

  public priceChangeEvent({
    price,
    index,
  }: Omit<TPriceSegmentData, 'carriages'>) {
    const newSegments = [...this.ride.segments];
    const newSegment = { ...newSegments[index] };
    newSegment.price = price;
    newSegments[index] = newSegment;
    this.emitRideChange(newSegments);
  }

  public dateChangeEvent({
    departure,
    arrival,
  }: Omit<TStationSegmentData, 'name' | 'id'>) {
    const newSegments = [...this.ride.segments];

    const updateSegmentTime = (
      time: string | undefined,
      index: number,
      isDeparture: boolean,
    ) => {
      if (time !== undefined && newSegments[index]) {
        const newSegment = { ...newSegments[index] };
        const newTime: [string, string] = [...newSegment.time];
        newTime[isDeparture ? 0 : 1] = time;
        newSegment.time = newTime;
        newSegments[index] = newSegment;
      }
    };

    updateSegmentTime(departure?.time, departure?.index ?? -1, true);
    updateSegmentTime(arrival?.time, arrival?.index ?? -1, false);
    this.emitRideChange(newSegments);
  }

  private emitRideChange(newSegments: TRideSegment[]): void {
    const newRide = { ...this.ride, segments: newSegments };
    this.rideChange.emit(newRide);
  }

  public deleteClick(event: Event) {
    event.stopPropagation();
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this ride?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        this.rideDelete.emit(this.ride.rideId);
      },
    });
  }

  public isStationSegmentData(
    data: TStationSegmentData | TPriceSegmentData,
  ): data is TStationSegmentData {
    return (data as TStationSegmentData).name !== undefined;
  }
}
