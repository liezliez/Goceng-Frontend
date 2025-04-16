import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './services/auth.guard';


export const routes: Routes = [
  { path: '', component: LandingPageComponent },       // Default route for landing page
  { path: 'login', component: LoginComponent },        // Route for login page
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }                       // Wildcard route
];
