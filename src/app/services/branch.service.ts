import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Branch } from '../models/branch.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  private baseUrl = `${environment.apiUrl}/branches`;;

  constructor(private http: HttpClient) {}

  getAllBranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>(this.baseUrl);
  }

  createBranch(data: Partial<Branch>): Observable<Branch> {
    return this.http.post<Branch>(this.baseUrl, data);
  }

  updateBranch(id: string, data: Partial<Branch>): Observable<Branch> {
    return this.http.put<Branch>(`${this.baseUrl}/${id}`, data);
  }

  deleteBranch(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}