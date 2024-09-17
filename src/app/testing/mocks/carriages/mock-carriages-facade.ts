import { CarriageMap } from '@/core/models/carriages.model';
import { signal, Signal } from '@angular/core';
import { of, Subject } from 'rxjs';
import { CarriagesState } from '@/redux/reducers';
import MockCarriagesData from './mock-carriages-data';

export default class MockCarriagesFacade {
  carriageMap: Signal<CarriageMap | undefined> = signal({});

  private carriageMapSubject = new Subject<CarriageMap>();

  carriageMap$ = this.carriageMapSubject.asObservable();

  carriages$ = of(MockCarriagesData.carriages);

  private stateSubject = new Subject<CarriagesState>();

  state$ = this.stateSubject.asObservable();

  updateMap() {}

  load() {}

  create() {
    return this.state$;
  }

  update() {
    return this.state$;
  }

  delete() {
    return this.state$;
  }

  setCarriageMap(map: CarriageMap) {
    this.carriageMapSubject.next(map);
  }

  setState(state: CarriagesState) {
    this.stateSubject.next(state);
  }
}
