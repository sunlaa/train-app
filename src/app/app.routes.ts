import { Routes } from '@angular/router';
import { SearchFormComponent } from './features/search-tickets/components/search-form/search-form.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: SearchFormComponent,
  },
];
