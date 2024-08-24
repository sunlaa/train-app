import { Routes } from '@angular/router';
import { SearchFormComponent } from './features/search-tickets/components/search-form/search-form.component';
import { SignUpFormComponent } from './features/registration-page/components/sign-up-form/sign-up-form.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: SearchFormComponent,
  },
  { path: 'signup', component: SignUpFormComponent },
];
