import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { AuthGuard } from './services/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';

export const routes: Routes = [

  // Public root route (Landing Page)
  { path: '', component: LandingPageComponent },

  { path: 'unauthorized', component: UnauthorizedComponent },

  // Redirect to landing page for unauthorized access

  // Optional alias
  { path: 'landing', redirectTo: '', pathMatch: 'full' },

  // Login
  { path: 'login', component: LoginComponent },

  // Authenticated routes
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
        path: 'users/create',
        loadComponent: () =>
          import('./components/user/create-user/create-user.component').then(m => m.CreateUserComponent),
        canActivate: [RoleGuard],
        data: { roles: ['SUPERADMIN'] }
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./components/user/user-management/user-management.component').then(m => m.UserManagementComponent),
        canActivate: [RoleGuard],
        data: { roles: ['SUPERADMIN'] }
      },
      {
        path: 'approval',
        loadComponent: () =>
          import('./components/application-approval/application-approval.component').then(m => m.ApplicationApprovalComponent),
        canActivate: [RoleGuard],
        data: { roles: ['MARKETING', 'BRANCH_MANAGER', 'BACK_OFFICE', 'SUPERADMIN'] } // example allowed roles
      },
    ],
  },

  // Catch-all
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
