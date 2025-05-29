import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Role } from '../models/role.model'; // Assuming you have a Role model defined

@Injectable({
  providedIn: 'root'
})
export class RoleFeatureService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/role-features`;

  addFeatureToRole(role: string, feature: string): Observable<any> {
    const params = new HttpParams()
      .set('roleName', role)
      .set('featureName', feature);
    return this.http.post(`${this.baseUrl}/add-feature`, null, { params });
  }

  removeFeatureFromRole(role: string, feature: string): Observable<any> {
    const params = new HttpParams()
      .set('roleName', role)
      .set('featureName', feature);
    return this.http.delete(`${this.baseUrl}/remove-feature`, { params });
  }

  hasFeature(role: string, feature: string): Observable<string> {
    const params = new HttpParams()
      .set('roleName', role)
      .set('featureName', feature);
    return this.http.get(`${this.baseUrl}/has-feature`, { params, responseType: 'text' });
  }

  getFeaturesForCurrentUser(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/features`);
  }

  getAllFeatures(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/all-features`);
  }

  getFeaturesByRole(role: string): Observable<string[]> {
    const params = new HttpParams().set('roleName', role);
    return this.http.get<string[]>(`${this.baseUrl}/features-by-role`, { params });
  }

  getAllRoles() {
    return this.http.get<Role[]>(`${environment.apiUrl}/roles`);
  }
}
