import { RoutesState } from './reducers/routes.reducer';
import { StationsState } from './reducers/stations.reducer';

export type AppState = {
  routes: RoutesState;
  stations: StationsState;
};
