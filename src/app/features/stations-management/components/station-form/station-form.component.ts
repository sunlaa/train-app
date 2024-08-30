import { Component, inject, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  TStationBasic,
  TStationCreation,
  TStationListed,
} from '@/core/models/stations.model';
import { DestroyService } from '@/core/services/destroy/destroy.service';
import { map, Observable, startWith, takeUntil } from 'rxjs';
import { NotificationService } from '@/shared/services/notification.service';
import { CommonModule } from '@angular/common';
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
    CommonModule,
  ],
  providers: [DestroyService],
  templateUrl: './station-form.component.html',
  styleUrl: './station-form.component.scss',
})
export class StationFormComponent implements OnInit {
  private destroy$ = inject(DestroyService);

  private notificationService = inject(NotificationService);

  private stationsFacade = inject(StationsFacadeService);

  private stationConnections = inject(StationConnectionsService);

  private fb = inject(FormBuilder);

  public mainStation: Partial<Omit<TStationBasic, 'id'>> = {};

  public stationForm = this.fb.group({
    mapData: this.fb.group({
      name: this.fb.control('', Validators.required),
      latitude: this.fb.control<number | null>(null, Validators.required),
      longitude: this.fb.control<number | null>(null, Validators.required),
    }),
    connections: this.fb.array<number>([]),
  });

  public buttonDisabled$!: Observable<boolean>;

  ngOnInit(): void {
    this.connections.push(this.fb.control(null));
    this.listenMapDataChanges();
    this.buttonDisabled$ = this.stationForm.valueChanges.pipe(
      startWith(null),
      takeUntil(this.destroy$),
      map(() => !this.formIsValid()),
    );
  }

  private listenMapDataChanges() {
    this.stationForm.controls.mapData.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ name, latitude, longitude }) => {
        this.mainStation = {
          city: name ?? undefined,
          latitude: latitude ?? undefined,
          longitude: longitude ?? undefined,
        };
      });
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

  get options() {
    return this.stationConnections.stationOptions;
  }

  public connectionChange(value: number, index: number) {
    const { controls } = this.connections;
    const isLast = index === controls.length - 1;
    if (controls[index].value === null) {
      return;
    }
    if (isLast) {
      this.connections.push(this.fb.control(null));
      this.stationConnections.connectStation(value);
    } else {
      this.stationConnections.reconnectStation(value, index);
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
    const { controls } = this.stationForm.controls.mapData;
    controls.latitude.setValue(latitude);
    controls.longitude.setValue(longitude);
  }

  public connect({ id }: TStationListed) {
    const lastIndex = this.connections.controls.length - 1;
    this.connections.controls[lastIndex].setValue(id);
    this.connectionChange(id, lastIndex);
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
    const { controls } = this.stationForm.controls.mapData;
    controls.name.reset();
    controls.latitude.reset();
    controls.longitude.reset();
    this.connections.clear();
    this.connections.push(this.fb.control(null));
    this.stationConnections.resetConnections();
  }

  private formIsValid() {
    return this.stationForm.valid && this.connections.controls.length >= 2;
  }

  public submitForm() {
    if (!this.formIsValid()) {
      return;
    }
    const { controls } = this.stationForm.controls.mapData;
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
