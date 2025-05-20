// customer.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';  // Adjust path if needed
import { CustomerResponse } from '../models/customer-response.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly baseUrl = `${environment.apiUrl}/customers`;

  constructor(private http: HttpClient) {}

  getCustomerById(id: string): Observable<CustomerResponse> {
    return this.http.get<CustomerResponse>(`${this.baseUrl}/${id}`);
  }
}
