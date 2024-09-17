import { TStationListed } from '@/core/models/stations.model';
import { formatStation } from '@/features/routes-management/utils';
import { inject, Injectable } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { StationsFacadeService } from './stations-facade.service';

@Injectable({
  providedIn: 'root',
})
export class StationConnectionsService {
  private stationsFacade = inject(StationsFacadeService);

  public stations: TStationListed[] = [];

  public connectedStations: TStationListed[] = [];

  public disconnectedStations: TStationListed[] = [];

  public stationOptions: SelectItem[][] = [];

  constructor() {
    this.loadStations();
  }

  private loadStations(): void {
    this.stationsFacade.stations$.subscribe((stations) => {
      this.stations = stations;
      this.disconnectedStations = [...this.stations];
      this.updateStationOptions();
    });
  }

  public connectStation(id: number) {
    const station = this.getStation(id);
    if (station) {
      this.connectedStations = [...this.connectedStations, station];
      this.disconnectedStations = this.disconnectedStations.filter(
        ({ id: stationId }) => stationId !== id,
      );
      this.updateStationOptions();
    }
  }

  public disconnectStation(id: number) {
    const station = this.getStation(id);
    if (station) {
      this.disconnectedStations = [...this.disconnectedStations, station];
      this.connectedStations = this.connectedStations.filter(
        ({ id: stationId }) => stationId !== id,
      );
      this.updateStationOptions();
    }
  }

  public reconnectStation(id: number, index: number) {
    const newStation = this.getStation(id);
    if (newStation) {
      const previousStation = this.connectedStations[index];
      const newDisconnectStations = this.disconnectedStations.filter(
        (s) => s.id !== newStation.id,
      );
      this.disconnectedStations = [...newDisconnectStations, previousStation];
      this.connectedStations[index] = newStation;
      this.updateStationOptions();
    }
  }

  public resetConnections() {
    this.disconnectedStations = [...this.stations];
    this.connectedStations = [];
    this.updateStationOptions();
  }

  private updateStationOptions(): void {
    const options: SelectItem[][] = [];
    if (this.connectedStations.length === 0) {
      options[0] = this.stations.map(formatStation);
    } else {
      for (let i = 0; i < this.connectedStations.length + 1; i += 1) {
        const connectedStation: TStationListed | undefined =
          this.connectedStations[i];
        const filteredStations = this.stations.filter(
          ({ id }) =>
            this.connectedStations.findIndex(
              ({ id: connectedId }) => id === connectedId,
            ) === -1,
        );
        const stationOptions = connectedStation
          ? [
              formatStation(connectedStation),
              ...filteredStations.map(formatStation),
            ]
          : filteredStations.map(formatStation);
        options.push(stationOptions);
      }
    }
    this.stationOptions = options;
  }

  private getStation(id: number): TStationListed | undefined {
    return this.stations.find(({ id: stationId }) => stationId === id);
  }
}
