import { Routes } from '@angular/router';
import { HomePageComponent } from './features/search-tickets/components/home-page/home-page.component';
import { AdminPageComponent } from './features/admin/components/admin-page/admin-page.component';
import { StationsPageComponent } from './features/stations-management/components/stations-page/stations-page.component';
import { CarriagesPageComponent } from './features/carriages-management/components/carriages-page/carriages-page.component';
import { RoutesPageComponent } from './features/routes-management/components/routes-page/routes-page.component';
import { RidesPageComponent } from './features/rides-management/components/rides-page/rides-page.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomePageComponent,
  },
  {
    path: 'admin',
    canActivate: [], // TODO: Add guard
    component: AdminPageComponent,
    children: [
      {
        path: 'stations',
        component: StationsPageComponent,
      },
      {
        path: 'carriages',
        component: CarriagesPageComponent,
      },
      {
        path: 'routes/:routeId',
        component: RidesPageComponent,
      },
      {
        path: 'routes',
        component: RoutesPageComponent,
      },
    ],
  },
];
