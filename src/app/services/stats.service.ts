import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private baseUrl = `${environment.apiUrl}/loans`;

  constructor(private http: HttpClient) {}

  getLoanTotalDisbursed(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/total-disbursed`);
  }

}
