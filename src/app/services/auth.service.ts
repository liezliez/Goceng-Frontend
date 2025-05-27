import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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

interface DecodedToken {
  role?: string;
  [key: string]: any;
}

const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USERNAME: 'username',
  FEATURES: 'features'
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, authRequest, {
      withCredentials: true
    });
  }

  saveUserDetails(authResponse: AuthResponse): void {
    localStorage.setItem(STORAGE_KEYS.TOKEN, authResponse.token);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, authResponse.refreshToken);
    localStorage.setItem(STORAGE_KEYS.USERNAME, authResponse.username);
    localStorage.setItem(STORAGE_KEYS.FEATURES, JSON.stringify(authResponse.features));
    console.log('Logged in features:', authResponse.features);
  }
  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/refresh`, {}, {
      withCredentials: true
    });
  }

  logout(): void {
    if (!this.getToken()) {
      this.clearStorage();
      return;
    }

    this.http.post(`${this.baseUrl}/logout`, {}, {
      withCredentials: true,
      responseType: 'text'
    }).subscribe({
      next: () => {
        console.info('🔒 Token blacklisted.');
        this.clearStorage();
      },
      error: err => {
        if (err.status === 401) {
          console.warn('⚠️ Token already invalid or expired.');
        } else {
          console.error('🚫 Logout failed:', err);
        }
        this.clearStorage();
      }
    });
  }

  private clearStorage(): void {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  }

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  getUsername(): string | null {
    return localStorage.getItem(STORAGE_KEYS.USERNAME);
  }
  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }
  getUserFeatures(): string[] {
    const features = localStorage.getItem(STORAGE_KEYS.FEATURES);
    return features ? JSON.parse(features) : [];
  }

  getUserBranch(): string | null {
    const payload = this.decodeToken();
    console.log('Decoded token payload:', payload);  // Debug output
    return payload?.['branchName'] ?? null;

  }

  getUserId(): string | null {
    const payload = this.decodeToken();
    return payload?.['id'] ?? null;
  }
  isLoggedIn(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;
      if (!expiry) return true;

      const now = Math.floor(Date.now() / 1000);
      return now > expiry;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return true;
    }
  }

  private decodeToken(): Record<string, any> | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = atob(token.split('.')[1]);
      return JSON.parse(payload);
    } catch (error) {
      console.error('Token decoding failed:', error);
      return null;
    }
  }

  getUserRole(): string | null {
    const payload = this.decodeToken() as DecodedToken | null;
    return typeof payload?.role === 'string' ? payload.role : null;
  }
}
