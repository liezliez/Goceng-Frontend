import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string; // 💖 Includes the username from backend
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:8080/api/v1/auth';

  constructor(private http: HttpClient) {}

  /**
   * 💌 Login the user with email and password.
   */
  login(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, authRequest, {
      withCredentials: true
    });
  }

  /**
   * 💾 Save token and username to localStorage.
   */
  saveUserDetails(authResponse: AuthResponse): void {
    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('username', authResponse.username);
  }

  /**
   * 🧼 Logout user: blacklist token and clean storage.
   */
  logout(): void {
    const token = this.getToken();

    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

      this.http.post(`${this.baseUrl}/logout`, {}, {
        headers,
        withCredentials: true,
        responseType: 'text'
      }).subscribe({
        next: () => {
          console.log('Token blacklisted successfully.');
          this.clearStorage();
        },
        error: err => {
          console.error('Logout error:', err);
          this.clearStorage();
        }
      });
    } else {
      this.clearStorage();
    }
  }

  /**
   * 🧹 Clears localStorage items.
   */
  private clearStorage(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }

  /**
   * 🪙 Get JWT token from localStorage.
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * 💁‍♀️ Get username from localStorage.
   */
  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  /**
   * ✅ Check if user is logged in.
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
