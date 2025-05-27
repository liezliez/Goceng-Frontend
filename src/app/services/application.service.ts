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

  // Use this method to get applications ONLY for current user's branch
  getApplicationsByCurrentUserBranch(): Observable<ApplicationResponse[]> {
    return this.http.get<ApplicationResponse[]>(`${this.baseUrl}/branch`);
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
}
// Compare this snippet from src/app/services/auth.service.ts:
