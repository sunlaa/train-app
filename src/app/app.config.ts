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
import {
  CarriagesEffects,
  StationsEffects,
  RoutesEffects,
  RidesEffects,
} from './redux/effects';
import {
  carriagesFeature,
  stationsFeature,
  routesFeature,
  ridesFeature,
} from './redux/reducers';
import { searchFeature } from './redux/reducers/search.reducer';
import { SearchEffects } from './redux/effects/search.effects';
import { cityApiInterceptor } from './features/search-tickets/interceptors/city-api.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([tokenInterceptor, cityApiInterceptor])),
    provideAnimationsAsync(),
    provideStore(),
    provideState(routesFeature),
    provideState(stationsFeature),
    provideState(carriagesFeature),
    provideState(searchFeature),
    provideState(ridesFeature),
    provideEffects([
      RoutesEffects,
      StationsEffects,
      CarriagesEffects,
      SearchEffects,
      RidesEffects,
    ]),
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
