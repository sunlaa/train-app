import { TStationListed } from '@/core/models/stations.model';
import { StationsFacadeService } from '@/features/stations-management/services/stations-facade.service';
import { inject, Injectable } from '@angular/core';
import { DropdownOptions } from '../types';
import { formatStation } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class StationsSectionService {
  private stationsFacade = inject(StationsFacadeService);

  public stations: TStationListed[] = [];

  private stationOptions: DropdownOptions = {
    original: [],
    secondLast: [],
    last: [],
  };

  loadStations(): void {
    this.stationsFacade.load();
    this.stationsFacade.stations$.subscribe((stations) => {
      this.stations = stations;
      this.updateStationOptions([]);
    });
  }

  getStationOptions(): DropdownOptions {
    return this.stationOptions;
  }

  updateStationOptions(selectedOptions: number[]): void {
    const lastIndex = selectedOptions.length - 1;
    const secondLastIndex = lastIndex - 1;
    const thirdLastIndex = secondLastIndex - 1;

    this.stationOptions.original = this.stations.map(formatStation);
    this.stationOptions.last = this.filterStations(
      this.stations,
      selectedOptions,
      secondLastIndex,
      selectedOptions,
    );
    this.stationOptions.secondLast = this.filterStations(
      this.stations,
      selectedOptions,
      thirdLastIndex,
      selectedOptions.slice(0, selectedOptions.length - 2),
    );
  }

  private filterStations(
    listedStations: TStationListed[],
    selectedOptions: number[],
    previousStationIndex: number,
    excludingOptions: number[],
  ) {
    const previousStation = listedStations.find(
      (station) => station.id === selectedOptions[previousStationIndex],
    );
    if (!previousStation) {
      return listedStations.map(formatStation);
    }
    return listedStations
      .filter((station) => {
        const stationIndex = previousStation.connectedTo.findIndex(
          ({ id }) => station.id === id && !excludingOptions.includes(id),
        );
        return stationIndex !== -1;
      })
      .map(formatStation);
  }
}
