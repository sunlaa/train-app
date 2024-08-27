import {
  TPriceSegmentData,
  TRideSegment,
  TRouteRide,
  TStationSegmentData,
} from '@/core/models/rides.model';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { StationSegmentComponent } from '../station-segment/station-segment.component';
import { PriceSegmentComponent } from '../price-segment/price-segment.component';

@Component({
  selector: 'app-ride-item',
  standalone: true,
  imports: [PanelModule, StationSegmentComponent, PriceSegmentComponent],
  templateUrl: './ride-item.component.html',
  styleUrl: './ride-item.component.scss',
})
export class RideItemComponent implements OnChanges {
  @Input() ride!: TRouteRide;

  @Input() stations!: string[];

  @Input() carriages!: string[];

  @Output() rideChange = new EventEmitter<TRouteRide>();

  public stationSegments!: TStationSegmentData[];

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
      name: station,
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
  }: Omit<TStationSegmentData, 'name'>) {
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

  public isStationSegmentData(
    data: TStationSegmentData | TPriceSegmentData,
  ): data is TStationSegmentData {
    return (data as TStationSegmentData).name !== undefined;
  }
}
