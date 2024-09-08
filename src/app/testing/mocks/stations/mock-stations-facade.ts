import { StationMap } from '@/core/models/stations.model';
import { Signal, signal } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { StationsState } from '@/redux/reducers';
import MockStationsData from './mock-stations-data';

export default class MockStationsFacade {
  stationMap: Signal<StationMap | undefined> = signal({ undefined });

  stationsMap$ = of(MockStationsData.stationMaps[0]);

  stations$ = of(MockStationsData.listedStations);

  private stateSubject = new Subject<StationsState>();

  state$ = this.stateSubject.asObservable();

  updateMap() {}

  load() {}

  create(): Observable<StationsState> {
    return this.state$;
  }

  delete(): Observable<StationsState> {
    return this.state$;
  }

  setState(state: StationsState) {
    this.stateSubject.next(state);
  }
}
