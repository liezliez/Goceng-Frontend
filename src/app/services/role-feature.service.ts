import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '../../environments/environment';

export class RoleFeatureService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/role-features`;

  addFeatureToRole(role: string, feature: string) {
    const params = new HttpParams().set('roleName', role).set('featureName', feature);
    return this.http.post(`${this.baseUrl}/add-feature`, null, { params });
  }

  removeFeatureFromRole(role: string, feature: string) {
    const params = new HttpParams().set('roleName', role).set('featureName', feature);
    return this.http.delete(`${this.baseUrl}/remove-feature`, { params });
  }

  hasFeature(role: string, feature: string) {
    const params = new HttpParams().set('roleName', role).set('featureName', feature);
    return this.http.get(`${this.baseUrl}/has-feature`, { params, responseType: 'text' });
  }

  getFeaturesForCurrentUser() {
    return this.http.get<string[]>(`${this.baseUrl}/features`);
  }
}
