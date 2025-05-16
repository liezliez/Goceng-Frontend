import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/list`).pipe(
      map(users => users.map(u => ({
        ...u,
        id: u.id,  // Use id as returned by API
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

  getAllRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/roles`);
  }
}
