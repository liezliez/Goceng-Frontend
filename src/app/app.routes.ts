import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { AuthGuard } from './services/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { BranchManagementComponent } from './components/branch-management/branch-management.component';

export const routes: Routes = [

  { path: '', component: LandingPageComponent },

  { path: 'unauthorized', component: UnauthorizedComponent },

  { path: 'landing', redirectTo: '', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  { path: 'reset-password', component: ResetPasswordComponent },

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
        data: { roles: ['ROLE_SUPERADMIN'] }
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./components/user/user-management/user-management.component').then(m => m.UserManagementComponent),
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_SUPERADMIN'] }
      },
      {
        path: 'manage-features',
        loadComponent: () =>
          import('./components/manage-feature/manage-feature.component').then(m => m.ManageFeatureComponent),
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_SUPERADMIN'] }
      },
      {
        path: 'approval',
        loadComponent: () =>
          import('./components/application-approval/application-approval.component').then(m => m.ApplicationApprovalComponent),
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_MARKETING', 'ROLE_BRANCH_MANAGER', 'ROLE_BACK_OFFICE', 'ROLE_SUPERADMIN'] }
      },
      {
        path: 'branch-management',
        component: BranchManagementComponent,
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_SUPERADMIN'] }
      },
      {
        path: 'change-password',
        loadComponent: () =>
          import('./components/change-password/change-password.component').then(m => m.ChangePasswordComponent)
      }
    ],
  },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];
