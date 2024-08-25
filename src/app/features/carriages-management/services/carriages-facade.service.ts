import { carriagesActions } from '@/redux/actions';
import { carriagesFeature } from '@/redux/reducers';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class CarriagesFacadeService {
  private store = inject(Store);

  get state$() {
    return this.store.select(carriagesFeature.selectCarriagesState);
  }

  get carriages$() {
    return this.store.select(carriagesFeature.selectCarriages);
  }

  public load() {
    this.store.dispatch(carriagesActions.load());
  }
}
