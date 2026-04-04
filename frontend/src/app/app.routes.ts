import { Routes } from '@angular/router';
import { SearchComponent } from './components/search/search';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
export const routes: Routes = [
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: 'search', component: SearchComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];
