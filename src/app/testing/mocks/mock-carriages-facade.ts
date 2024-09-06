import { CarriageMap, TCarriage } from '@/core/models/carriages.model';
import { signal, Signal } from '@angular/core';
import { of } from 'rxjs';

export default class MockCarriagesFacade {
  carriageMap: Signal<CarriageMap | undefined> = signal({});

  carriageMap$ = of({});

  carriages$ = of([]);

  state$ = of({});

  updateMap() {}

  load() {}

  create(carriage: Omit<TCarriage, 'code'>) {
    return carriage;
  }

  update(carriage: TCarriage) {
    return carriage;
  }

  delete(code: string) {
    return code;
  }
}
