import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { Branch } from '../models/branch.model';
import { ROLES } from '../components/constants/roles';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = `${environment.apiUrl}/users`;
  private readonly branchUrl = `${environment.apiUrl}/branches`;
  private readonly rolesUrl = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) {}

  getCurrentUser(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) as User : null;
  }

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`, {
      withCredentials: true
    });
  }

  getUserBranch(): string | null {
    const user = this.getCurrentUser();
    return user?.branch?.name ?? null;
  }

  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user?.role?.roleName ?? null;
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/list`).pipe(
      map(users => users.map(u => ({
        ...u,
        id: u.id,
        account_status: u.account_status || 'N/A',
        role: u.role ? {
          id: u.role.id,
          roleName: u.role.roleName
        } : undefined,
        branch: u.branch ? {
          id: u.branch.id,
          name: u.branch.name
        } : undefined,
        employee: u.employee ? {
          id: u.employee.id,
          name: u.employee.name
        } : null
      })))
    );
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/id/${id}`);
  }

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/email`, {
      params: { email }
    });
  }

  softDeleteUser(userId: string): Observable<string> {
    return this.http.put(`${this.baseUrl}/id/${userId}/delete`, {}, {
      responseType: 'text'
    });
  }

  restoreUser(userId: string): Observable<string> {
    return this.http.put(`${this.baseUrl}/id/${userId}/restore`, {}, {
      responseType: 'text'
    });
  }

  editUser(userId: string, userData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/id/${userId}/edit`, userData);
  }

  createUser(userData: any, branchId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}`, userData, {
      params: { branchId }
    });
  }

getAllBranches(): Observable<Branch[]> {
  return this.http.get<Branch[]>(`${environment.apiUrl}/branches`);
}

  createEmployeeWithRole(role: string, employeeData: {
    name: string;
    email: string;
    password: string;
    branchId?: string;
  }): Observable<any> {
    const payload = {
      ...employeeData,
      role
    };

    const options = employeeData.branchId
      ? { params: { branchId: employeeData.branchId } }
      : {};

    return this.http.post(`${this.baseUrl}`, payload, options);
  }

  getAllRoles(): Observable<{ id: number; roleName: string }[]> {
    return this.http.get<{ id: number; roleName: string }[]>(this.rolesUrl);
  }
}
