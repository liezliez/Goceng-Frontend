import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:8080/api/v1/auth'; // Backend URL for authentication

  constructor(private http: HttpClient) {}

  /**
   * Login the user with the provided credentials.
   * @param authRequest {AuthRequest} - The login credentials (email and password)
   * @returns Observable<AuthResponse> - The response containing the JWT token
   */
  login(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, authRequest);
  }

  /**
   * Logout the user by removing the token from localStorage.
   */
  logout(): void {
    localStorage.removeItem('token');  // Clear the stored token
  }

  /**
   * Store the JWT token in localStorage.
   * @param token {string} - The JWT token to store
   */
  setToken(token: string): void {
    localStorage.setItem('token', token);  // Store the token in localStorage
  }

  /**
   * Retrieve the stored JWT token from localStorage.
   * @returns string | null - The stored token or null if not present
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Check if the user is logged in by verifying if a token is present.
   * @returns boolean - True if the user is logged in, false otherwise
   */
  isLoggedIn(): boolean {
    return !!this.getToken();  // Return true if a token is found
  }
}
