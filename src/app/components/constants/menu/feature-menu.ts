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
    feature: 'VIEW_DASHBOARD'  // Make sure userFeatures includes this exactly
  },
  {
    label: 'Manage Users',
    icon: 'bi-people',
    route: '/users',
    feature: 'MANAGE_USERS'  // If your userFeatures has 'VIEW_ALL_USERS' instead of 'MANAGE_USERS', update this here.
  },
  {
    label: 'Approval',
    icon: 'bi-check2-square',
    route: '/approval',
    feature: 'APPROVE_APPLICATION'  // Exactly match userFeatures string
  },
  {
    label: 'Create User',
    icon: 'bi-person-plus',
    route: '/users/create',
    feature: 'CREATE_USER'  // This feature should exist in user's permissions to see this menu
  }
  // other items
];
