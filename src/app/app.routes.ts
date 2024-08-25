import { Routes } from '@angular/router';
import { HomePageComponent } from './features/search-tickets/components/home-page/home-page.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomePageComponent,
  },
];
