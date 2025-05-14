// src/app/models/user.model.ts

export interface User {
  idUser: string;          // UUID
  name: string;            // User's full name
  email: string;           // User's email address
  password?: string;       // Password is optional for some operations (e.g., when creating or editing)
  accountStatus: string;   // Active, Banned, etc. (enum)
  role: {
    idRole: string;        // Role ID
    roleName: string;      // Role name (e.g., 'ADMIN', 'USER', etc.)
  };
  branch?: {
    idBranch: string;      // Optional branch ID (can be null)
    branchName: string;    // Optional branch name (if available)
  };
  employee?: {
    idEmployee: string;    // Optional employee ID
    employeeName: string;  // Optional employee name
  };
}
