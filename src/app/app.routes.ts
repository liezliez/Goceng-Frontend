import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { AuthGuard } from './services/auth.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'landing', component: LandingPageComponent },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./components/user/user-management/user-management.component').then(m => m.UserManagementComponent),
      },
      {
        path: 'approval',
        loadComponent: () =>
          import('./components/application-approval/application-approval.component').then(m => m.ApplicationApprovalComponent),
      },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
