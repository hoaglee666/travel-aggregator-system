import { Routes } from '@angular/router';
import { SearchComponent } from './components/search/search';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { DashboardComponent } from './components/dashboard/dashboard';
import { CheckoutComponent } from './components/checkout/checkout';
import { adminGuard } from './guards/admin-guard'; // 1. Import the Guard
import { AdminComponent } from './components/admin/admin';
import { authGuard } from './guards/auth.guard';
import { ProfileComponent } from './components/profile/profile';
export const routes: Routes = [
  { path: '', redirectTo: '/search', pathMatch: 'full' },

  // Public Routes
  { path: 'search', component: SearchComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Protected Routes (Guarded!)
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard], // 2. Apply the lock
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [authGuard], // 3. Apply the lock
  },
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
];
