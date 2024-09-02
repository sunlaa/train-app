import { Routes } from '@angular/router';
import { HomePageComponent } from './features/search-tickets/components/home-page/home-page.component';
import { AdminPageComponent } from './features/admin/components/admin-page/admin-page.component';
import { StationsPageComponent } from './features/stations-management/components/stations-page/stations-page.component';
import { CarriagesPageComponent } from './features/carriages-management/components/carriages-page/carriages-page.component';
import { RoutesPageComponent } from './features/routes-management/components/routes-page/routes-page.component';
import { RidesPageComponent } from './features/rides-management/components/rides-page/rides-page.component';
import { TripDetailsComponent } from './features/trip-details/components/trip-details/trip-details.component';
import { tripQueryGuard } from './core/guards/trip/trip-query.guard';
import { signupGuard } from './features/auth/guards/signup.guard';
import { profileGuard } from './features/profile/guards/profile.guard';
import { OrdersPageComponent } from './features/orders/components/orders-page/orders-page.component';
import { notGuestGuard } from './features/auth/guards/not-guest.guard';
import { adminGuard } from './features/auth/guards/admin.guard';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { NotAuthorizedComponent } from './core/components/not-authorized/not-authorized.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomePageComponent,
  },
  {
    path: 'trip/:rideId',
    pathMatch: 'full',
    component: TripDetailsComponent,
    canActivate: [tripQueryGuard],
  },
  {
    path: 'orders',
    pathMatch: 'full',
    component: OrdersPageComponent,
    canActivate: [notGuestGuard],
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
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
  {
    path: 'signup',
    loadComponent: () =>
      import(
        '@/features/auth/components/register-form/register-form.component'
      ).then((m) => m.RegisterFormComponent),
    canActivate: [signupGuard],
  },
  {
    path: 'signin',
    loadComponent: () =>
      import('@/features/auth/components/login-form/login-form.component').then(
        (m) => m.LoginFormComponent,
      ),
    canActivate: [signupGuard],
  },
  {
    path: 'profile',
    loadComponent: () =>
      import(
        '@/features/profile/components/profile-page/profile-page.component'
      ).then((m) => m.ProfilePageComponent),
    canActivate: [profileGuard],
  },
  { path: 'unauthorized', component: NotAuthorizedComponent },
  { path: '**', component: NotFoundComponent },
];
