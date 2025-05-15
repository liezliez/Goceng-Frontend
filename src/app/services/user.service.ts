import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';  // Make sure the path is correct

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = `${environment.apiUrl}/users`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    }
    return new HttpHeaders({ Authorization: `Bearer ${token ?? ''}` });
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/list`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(users => users.map(u => ({
        ...u,
        id: u.id,  // use id as returned by API
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
    return this.http.get<User>(`${this.baseUrl}/id/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/email`, {
      headers: this.getAuthHeaders(),
      params: { email }
    });
  }

  softDeleteUser(userId: string): Observable<string> {
    return this.http.put(`${this.baseUrl}/id/${userId}/delete`, {}, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    });
  }

  restoreUser(userId: string): Observable<string> {
    return this.http.put(`${this.baseUrl}/id/${userId}/restore`, {}, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    });
  }

  editUser(userId: string, userData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/id/${userId}/edit`, userData, {
      headers: this.getAuthHeaders()
    });
  }

  createUser(userData: any, branchId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}`, userData, {
      headers: this.getAuthHeaders(),
      params: { branchId }
    });
  }

  getAllRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/roles`, {
      headers: this.getAuthHeaders()
    });
  }
}
