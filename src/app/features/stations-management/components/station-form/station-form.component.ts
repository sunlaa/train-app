import { Component, inject, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  TStationBasic,
  TStationCreation,
  TStationListed,
} from '@/core/models/stations.model';
import { DestroyService } from '@/core/services/destroy/destroy.service';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { NotificationService } from '@/shared/services/notification.service';
import { StationsFacadeService } from '../../services/stations-facade.service';
import { MapComponent } from '../map/map.component';
import { StationConnectionsService } from '../../services/station-connections.service';

@Component({
  selector: 'app-station-form',
  standalone: true,
  imports: [
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    ButtonModule,
    MapComponent,
    ReactiveFormsModule,
  ],
  providers: [DestroyService],
  templateUrl: './station-form.component.html',
  styleUrl: './station-form.component.scss',
})
export class StationFormComponent implements OnInit {
  private destroy$ = inject(DestroyService);

  private stationsFacade = inject(StationsFacadeService);

  private notificationService = inject(NotificationService);

  private fb = inject(FormBuilder);

  public mainStation: Partial<Omit<TStationBasic, 'id'>> = {};

  private stationConnections = inject(StationConnectionsService);

  public stationForm = this.fb.group({
    name: this.fb.control('', Validators.required),
    latitude: this.fb.control<number | null>(null, Validators.required),
    longitude: this.fb.control<number | null>(null, Validators.required),
    connections: this.fb.array<number>([]),
  });

  ngOnInit(): void {
    this.connections.push(this.fb.control(null));
    this.stationConnections.loadStations();
    this.listenFormChanges();
  }

  private listenFormChanges() {
    const { controls } = this.stationForm;
    this.changesListener(controls.name, true, (name) => {
      this.mainStation = { ...this.mainStation, city: name ?? undefined };
    });
    this.changesListener(controls.latitude, false, (lat) => {
      this.mainStation = { ...this.mainStation, latitude: lat ?? undefined };
    });
    this.changesListener(controls.longitude, false, (lng) => {
      this.mainStation = { ...this.mainStation, longitude: lng ?? undefined };
    });
  }

  private changesListener<T>(
    control: FormControl<T>,
    debounce: boolean,
    callback: (data: T) => void,
  ) {
    const observable = control.valueChanges.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged(),
    );

    if (debounce) {
      observable.pipe(debounceTime(500)).subscribe(callback);
    } else {
      observable.subscribe(callback);
    }
  }

  get connections() {
    return this.stationForm.controls.connections;
  }

  get connectedStations() {
    return this.stationConnections.connectedStations;
  }

  get disconnectedStations() {
    return this.stationConnections.disconnectedStations;
  }

  public getOptions(index: number) {
    return this.stationConnections.stationOptions[index];
  }

  public connectionChange(index: number) {
    const { controls } = this.connections;
    const connectionId = controls[index].value;
    const isLast = index === undefined || index === controls.length - 1;
    if (connectionId === null) {
      return;
    }
    if (isLast) {
      this.connections.push(this.fb.control(null));
      this.stationConnections.connectStation(connectionId);
    } else {
      this.stationConnections.reconnectStation(connectionId, index);
    }
  }

  public removeConnection(index: number) {
    const connectionId = this.connections.controls[index].value;
    if (connectionId) {
      this.stationConnections.disconnectStation(connectionId);
    }
    this.connections.removeAt(index);
  }

  public trackStation(value: number | null, index: number) {
    return (value?.toString() ?? 'null') + index.toString();
  }

  public mapClick(location: Pick<TStationBasic, 'latitude' | 'longitude'>) {
    const { latitude, longitude } = location;
    const { controls } = this.stationForm;
    controls.latitude.setValue(latitude);
    controls.longitude.setValue(longitude);
  }

  public connect({ id }: TStationListed) {
    this.connections.controls[this.connections.controls.length - 1].setValue(
      id,
    );
    this.connections.push(this.fb.control(null));
    this.stationConnections.connectStation(id);
  }

  public disconnect({ id }: TStationListed) {
    const index = this.connections.controls.findIndex(
      (ctrl) => ctrl.value === id,
    );
    if (index !== -1) {
      this.connections.removeAt(index);
      this.stationConnections.disconnectStation(id);
    }
  }

  private resetForm() {
    this.stationForm.reset();
    this.connections.clear();
    this.connections.push(this.fb.control(null));
    this.stationConnections.resetConnections();
  }

  public submitForm() {
    if (this.stationForm.invalid || this.connections.controls.length <= 1) {
      return;
    }
    const { controls } = this.stationForm;
    const station: TStationCreation = {
      city: controls.name.value!,
      latitude: controls.latitude.value!,
      longitude: controls.longitude.value!,
      relations: this.connections.controls
        .map((ctrl) => ctrl.value)
        .filter((id) => id !== null) as number[],
    };
    this.createStation(station);
    this.resetForm();
  }

  private createStation(station: TStationCreation) {
    this.stationsFacade.create(station).subscribe(({ status, error }) => {
      if (status === 'success') {
        this.notificationService.messageSuccess('Station created');
      } else if (status === 'error') {
        this.notificationService.messageError(error?.message);
      }
    });
  }
}
