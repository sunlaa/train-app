import { CarriageMap, TCarriage } from '@/core/models/carriages.model';
import { carriagesActions } from '@/redux/actions';
import { carriagesFeature } from '@/redux/reducers';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs';

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

  public create(carriage: Omit<TCarriage, 'code'>) {
    this.store.dispatch(carriagesActions.create({ carriage }));
    return this.determinedState();
  }

  public update(carriage: TCarriage) {
    this.store.dispatch(carriagesActions.update({ carriage }));
    return this.determinedState();
  }

  public delete(code: string) {
    this.store.dispatch(carriagesActions.delete({ code }));
    return this.determinedState();
  }

  private determinedState() {
    return this.state$.pipe(
      filter(({ status }) => status !== 'loading'),
      take(1),
    );
  }
}
