export interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  feature: string;
  children?: MenuItem[];
  expanded?: boolean;
}

export const FEATURE_BASED_MENU: MenuItem[] = [
  {
    label: 'Dashboard',
    route: '/dashboard',
    icon: 'bi-speedometer2',
    feature: 'VIEW_DASHBOARD'
  },
  {
    label: 'Manage Users',
    icon: 'bi-people',
    route: '/users',
    feature: 'MANAGE_USERS'
  },
  {
    label: 'Approval',
    icon: 'bi-check2-square',
    route: '/approval',
    feature: 'APPROVE_APPLICATION'
  },
  {
    label: 'Create User',
    icon: 'bi-person-plus',
    route: '/users/create',
    feature: 'CREATE_USER'
  },
  {
    label: 'Change Password',
    icon: 'bi-key',
    route: '/change-password',
    feature: 'CHANGE_PASSWORD'
  }
];
