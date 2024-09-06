import { TStationListed } from '@/core/models/stations.model';
import { SelectItem } from 'primeng/api';

export default class MockStationsSection {
  stations: TStationListed[] = [];

  stationOptions: SelectItem[][] = [];

  loadStations() {}

  updateStationOptions(selectedOptions: number[]) {
    return selectedOptions;
  }
}
