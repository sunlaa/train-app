import { StationMap, TStationCreation } from '@/core/models/stations.model';
import { Signal, signal } from '@angular/core';
import { of } from 'rxjs';

export default class MockStationsFacade {
  stationMap: Signal<StationMap | undefined> = signal({ undefined });

  stationsMap$ = of({});

  stations$ = of([]);

  state$ = of({});

  updateMap() {}

  load() {}

  create(station: TStationCreation) {
    return station;
  }

  delete(id: number) {
    return id;
  }
}
