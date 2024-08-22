import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { RoutesState } from '../reducers/routes.reducer';

export const selectRoutes = (state: AppState) => {
  return state.routes;
};
export const selectRoutesState = createSelector(
  selectRoutes,
  (state: RoutesState) => state,
);
