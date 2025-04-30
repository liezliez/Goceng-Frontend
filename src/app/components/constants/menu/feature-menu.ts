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
    feature: 'MANAGE_USERS',
    children: [
      {
        label: 'Update User',
        route: '/users/update',
        icon: 'bi-pencil-square',
        feature: 'UPDATE_USER'
      },
      {
        label: 'Restore User',
        route: '/users/restore',
        icon: 'bi-arrow-counterclockwise',
        feature: 'RESTORE_USER'
      },
      {
        label: 'Delete User',
        route: '/users/delete',
        icon: 'bi-trash',
        feature: 'DELETE_USER'
      }
    ]
  }
  ,
  {
    label: 'Dashboard',
    route: '/dashboard',
    icon: 'bi-speedometer2',
    feature: 'VIEW_DASHBOARD'
  },
  // ... other items
];
