import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { tokenInterceptor } from './features/auth/interceptors/token.interceptor';
import { routesReducer } from './redux/reducers/routes.reducer';
import { RoutesEffects } from './redux/effects/routes.effects';
import { StationsEffects } from './redux/effects/stations.effects';
import { stationsReducer } from './redux/reducers/stations.reducer';
import { carriagesReducer } from './redux/reducers/carriages.reducer';
import { CarriagesEffects } from './redux/effects/carriages.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([tokenInterceptor])),
    provideAnimationsAsync(),
    provideStore(),
    provideState({ name: 'routes', reducer: routesReducer }),
    provideState({ name: 'stations', reducer: stationsReducer }),
    provideState({ name: 'carriages', reducer: carriagesReducer }),
    provideEffects([RoutesEffects, StationsEffects, CarriagesEffects]),
    provideRouterStore(),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
      connectInZone: true,
    }),
  ],
};
