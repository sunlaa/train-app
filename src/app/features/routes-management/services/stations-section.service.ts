import { TStationListed } from '@/core/models/stations.model';
import { StationsFacadeService } from '@/features/stations-management/services/stations-facade.service';
import { inject, Injectable } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { formatStation } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class StationsSectionService {
  private stationsFacade = inject(StationsFacadeService);

  public stations: TStationListed[] = [];

  public stationOptions: SelectItem[][] = [];

  public loadStations(): void {
    this.stationsFacade.stations$.subscribe((stations) => {
      this.stations = stations;
      this.updateStationOptions([]);
    });
  }

  public updateStationOptions(selectedOptions: number[]): void {
    const selectedStationIds = selectedOptions.filter(
      (option) => typeof option === 'number',
    );
    if (selectedStationIds.length === 0) {
      this.stationOptions = [this.stations.map(formatStation)];
    } else {
      const options: SelectItem[][] = [];
      for (let i = 0; i < selectedStationIds.length + 1; i += 1) {
        let commonIds: number[] = [];
        const previousStationId = selectedStationIds[i - 1];
        const previousStation = this.getStation(previousStationId);
        if (previousStation) {
          commonIds.push(previousStationId);
          const previousConnections =
            this.getStationConnections(previousStation);
          commonIds = [...previousConnections];
        }
        const nextStationId = selectedStationIds[i + 1];
        const nextStation = this.getStation(nextStationId);
        if (nextStation) {
          const nextConnections = this.getStationConnections(nextStation);
          if (commonIds.length === 0) {
            commonIds = [...nextConnections];
          } else {
            commonIds = commonIds.filter((id) => nextConnections.includes(id));
          }
        }
        if (previousStation || nextStation) {
          commonIds = commonIds.filter(
            (id) => !selectedStationIds.includes(id),
          );
          commonIds = [selectedStationIds[i], ...commonIds];
          const commonStations = commonIds.map((id) => this.getStation(id));
          const filteredStations: TStationListed[] = commonStations.filter(
            (station) => station !== undefined,
          ) as TStationListed[];
          options.push(filteredStations.map(formatStation));
        } else {
          options.push(this.stations.map(formatStation));
        }
      }
      this.stationOptions = options;
    }
  }

  private getStationConnections(station: TStationListed): number[] {
    return station.connectedTo.map((connection) => connection.id);
  }

  private getStation(id: number | undefined) {
    if (id === undefined) return undefined;
    return this.stations.find((station) => station.id === id);
  }
}
