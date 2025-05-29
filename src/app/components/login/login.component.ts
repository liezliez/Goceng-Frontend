import { Component } from '@angular/core';
import { AuthService, AuthRequest } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  authRequest: AuthRequest = { email: '', password: '' };
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.authRequest).subscribe({
      next: (res) => {
        this.authService.saveUserDetails(res);

        const role = this.authService.getUserRole();
        if (role === 'CUSTOMER') {
          this.error = 'Customers are not allowed to log in here, Please use the Goceng App.';
          this.authService.logout();
          return;
        }

        this.error = '';
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        if (err?.status === 401 && err.error?.message) {
          this.error = err.error.message;
        } else if (err?.error) {
          if (typeof err.error === 'string') {
            this.error = err.error;
          }
          else if (typeof err.error === 'object') {
            this.error = err.error.message || 'Login failed. Please try again.';
          } else {
            this.error = 'Unexpected error occurred.';
          }
        } else {
          this.error = 'Invalid login credentials. Please try again.';
        }
      }

    });
  }

}
