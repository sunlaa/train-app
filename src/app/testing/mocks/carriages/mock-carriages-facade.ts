import { CarriageMap } from '@/core/models/carriages.model';
import { signal, Signal } from '@angular/core';
import { of, Subject } from 'rxjs';
import { CarriagesState } from '@/redux/reducers';
import MockCarriagesData from './mock-carriages-data';

export default class MockCarriagesFacade {
  carriageMap: Signal<CarriageMap | undefined> = signal({});

  carriageMap$ = of({});

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

  setState(state: CarriagesState) {
    this.stateSubject.next(state);
  }
}
