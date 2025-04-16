import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';  // Import catchError for error handling
import { of } from 'rxjs';  // Import 'of' to return fallback values in case of errors

// Assuming these interfaces are defined elsewhere
interface Stats {
  totalLoanDisbursed: string;
  appDownloads: string;
}

interface LoanOption {
  amount: string;
  duration: string;
}

interface Testimonial {
  name: string;
  age: number;
  amount: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class LandingPageService {
  private baseUrl = 'http://localhost:8080/api/landing'; // Update if backend port changes

  constructor(private http: HttpClient) {}

  getStats(): Observable<Stats> {
    return this.http.get<Stats>(`${this.baseUrl}/stats`).pipe(
      catchError(err => {
        console.error('Error fetching stats', err);
        return of({ totalLoanDisbursed: '', appDownloads: '' }); // Return default value on error
      })
    );
  }

  getLoanOptions(): Observable<LoanOption[]> {
    return this.http.get<LoanOption[]>(`${this.baseUrl}/loan-options`).pipe(
      catchError(err => {
        console.error('Error fetching loan options', err);
        return of([]);  // Return an empty array on error
      })
    );
  }

  getTestimonials(): Observable<Testimonial[]> {
    return this.http.get<Testimonial[]>(`${this.baseUrl}/testimonials`).pipe(
      catchError(err => {
        console.error('Error fetching testimonials', err);
        return of([]);  // Return an empty array on error
      })
    );
  }
}
