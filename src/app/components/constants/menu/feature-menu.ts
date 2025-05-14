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
    label: 'Manage Users',
    icon: 'bi-people',
    route: '/users', // 🚀 Route to the main Manage Users page
    feature: 'MANAGE_USERS'
  },
  {
    label: 'Dashboard',
    route: '/dashboard',
    icon: 'bi-speedometer2',
    feature: 'VIEW_DASHBOARD'
  }

  // ... other items
];
