import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
    if (!token) this.router.navigate(['/login']);
    return new HttpHeaders({ Authorization: `Bearer ${token ?? ''}` });
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/list`, {
      headers: this.getAuthHeaders()
    });
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/id/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  getUserByEmail(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/email`, {
      headers: this.getAuthHeaders(),
      params: { email }
    });
  }

  softDeleteUser(userId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/id/${userId}/delete`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  restoreUser(userId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/id/${userId}/restore`, {}, {
      headers: this.getAuthHeaders()
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

  getAllRoles() {
    return this.http.get<any[]>(`${environment.apiUrl}/roles`, {
      headers: this.getAuthHeaders()
    });
  }



}
