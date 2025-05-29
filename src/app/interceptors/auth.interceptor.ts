import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable, throwError, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Skip interception for authentication-related endpoints
  const skipUrls = ['/login', '/logout', '/auth/login', '/auth/logout'];
  const shouldSkip = skipUrls.some(url => req.url.includes(url));

  if (shouldSkip) {
    return next(req);
  }

  const token = authService.getToken();

  // If token exists but is expired, log the user out and cancel the request
  if (token && authService.isTokenExpired()) {
    authService.logout();
    router.navigate(['/login']);
    return EMPTY;
  }

  // Clone the request to add the Authorization header if a valid token exists
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err) => {
      // Handle unauthorized access by logging out and redirecting to login
      if (err.status === 401) {
        authService.logout();
        router.navigate(['/login']);
        return EMPTY;
      }

      // Optionally handle other HTTP error statuses globally
      return throwError(() => err);
    })
  );
};
