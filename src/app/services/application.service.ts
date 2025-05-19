import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApplicationResponse } from '../models/application-response.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private baseUrl = 'http://localhost:8080/be/applications';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApplicationResponse[]> {
    return this.http.get<ApplicationResponse[]>(`${this.baseUrl}`);
  }

  marketingApprove(id: string, isApproved: boolean, note: string): Observable<ApplicationResponse> {
    return this.http.put<ApplicationResponse>(
      `${this.baseUrl}/${id}/approve/marketing`,
      { isApproved, note }
    );
  }

  branchManagerApprove(id: string, isApproved: boolean, note: string): Observable<ApplicationResponse> {
    return this.http.put<ApplicationResponse>(
      `${this.baseUrl}/${id}/approve/branch-manager`,
      { isApproved, note }
    );
  }

  backOfficeApprove(id: string, isApproved: boolean, note: string): Observable<ApplicationResponse> {
    return this.http.put<ApplicationResponse>(
      `${this.baseUrl}/${id}/approve/back-office`,
      { isApproved, note }
    );
  }

  getApplicationsByCurrentUserBranch(): Observable<ApplicationResponse[]> {
    return this.http.get<ApplicationResponse[]>(`${this.baseUrl}/branch`);
  }
  
}
// Compare this snippet from src/app/services/auth.service.ts: