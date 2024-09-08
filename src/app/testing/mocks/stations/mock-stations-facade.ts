import { StationMap, TStationListed } from '@/core/models/stations.model';
import { Signal, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { StationsState } from '@/redux/reducers';

export default class MockStationsFacade {
  stationMap: Signal<StationMap | undefined> = signal({ undefined });

  private stationsMapSubject = new Subject<StationMap>();

  stationsMap$ = this.stationsMapSubject.asObservable();

  private stationsSubject = new Subject<TStationListed[]>();

  stations$ = this.stationsSubject.asObservable();

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

  setStationsMap(map: StationMap) {
    this.stationsMapSubject.next(map);
  }

  setStations(stations: TStationListed[]) {
    this.stationsSubject.next(stations);
  }

  setState(state: StationsState) {
    this.stateSubject.next(state);
  }
}
