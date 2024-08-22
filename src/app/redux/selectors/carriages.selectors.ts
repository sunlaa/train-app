import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { CarriagesState } from '../reducers/carriages.reducer';

export const selectRoutes = (state: AppState) => {
  return state.carriages;
};
export const selectCarriagesState = createSelector(
  selectRoutes,
  (state: CarriagesState) => state,
);
