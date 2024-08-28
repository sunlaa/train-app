import { Routes } from '@angular/router';
import { HomePageComponent } from './features/search-tickets/components/home-page/home-page.component';
import { SearchFormComponent } from './features/search-tickets/components/search-form/search-form.component';
import { AdminPageComponent } from './features/admin/components/admin-page/admin-page.component';
import { StationsPageComponent } from './features/stations-management/components/stations-page/stations-page.component';
import { CarriagesPageComponent } from './features/carriages-management/components/carriages-page/carriages-page.component';
import { RoutesPageComponent } from './features/routes-management/components/routes-page/routes-page.component';

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
        path: 'routes',
        component: RoutesPageComponent,
      },
    ],
  },
];
