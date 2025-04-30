import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  username: string;
  expiresAt: number;
  features: string[];
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
   * 💾 Save token, username, and features to localStorage.
   */
  saveUserDetails(authResponse: AuthResponse): void {
    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('refreshToken', authResponse.refreshToken);
    localStorage.setItem('username', authResponse.username);
    localStorage.setItem('features', JSON.stringify(authResponse.features));
  }

  /**
   * 🧼 Logout user: blacklist token and clean storage.
   */
  logout(): void {
    const token = this.getToken();

    if (!token) {
      this.clearStorage();
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.post(`${this.baseUrl}/logout`, {}, {
      headers,
      withCredentials: true,
      responseType: 'text'
    }).subscribe({
      next: () => {
        console.log('🔒 Token blacklisted successfully.');
        this.clearStorage();
      },
      error: err => {
        if (err.status === 401) {
          console.warn('⚠️ Token already invalid or expired. Proceeding with logout.');
        } else {
          console.error('🚫 Logout error:', err);
        }
        this.clearStorage();
      }
    });
  }

  /**
   * 🧹 Clears localStorage items.
   */
  private clearStorage(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    localStorage.removeItem('features');
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
   * 📜 Get user features from localStorage.
   */
  getUserFeatures(): string[] {
    const features = localStorage.getItem('features');
    return features ? JSON.parse(features) : [];
  }

  /**
   * ✅ Check if user is logged in.
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * 🔍 Decode JWT payload
   */
  private decodeToken(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * 🎭 Get user role from token
   */
  getUserRole(): string | null {
    const payloadJson = this.decodeToken();
    return payloadJson?.role || null;
  }
}
