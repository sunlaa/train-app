import { CarriageMap } from '@/core/models/carriages.model';
import { carriagesActions } from '@/redux/actions';
import { carriagesFeature } from '@/redux/reducers';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class CarriagesFacadeService {
  private store = inject(Store);

  public carriageMap: Signal<CarriageMap | undefined> = signal(undefined);

  constructor() {
    this.updateMap();
  }

  get state$() {
    return this.store.select(carriagesFeature.selectCarriagesState);
  }

  get carriages$() {
    return this.store.select(carriagesFeature.selectCarriages);
  }

  get carriageMap$() {
    return this.store.select(carriagesFeature.selectCarriageMap);
  }

  updateMap() {
    this.load();
    this.carriageMap = toSignal(this.carriageMap$);
  }

  public load() {
    this.store.dispatch(carriagesActions.load());
  }
}
