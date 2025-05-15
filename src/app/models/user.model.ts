export interface User {
  id: string;               // matches backend `id`
  name: string;
  email: string;
  account_status: string;   // matches backend field name exactly
  role?: {
    id: number | string;    // matches backend `role.id`
    roleName: string;       // role display name
  };
  branch?: {
    id: string;             // matches backend `branch.id`
    name: string;           // branch name
  };
  employee?: {
    id: string;             // matches backend `employee.id`
    name: string;           // employee name
  } | null;
}
export interface UserRole {
  id: number;
  roleName: string;
}