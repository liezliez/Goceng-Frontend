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
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  authRequest: AuthRequest = { email: '', password: '' };
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.authRequest).subscribe({
      next: (res) => {
        console.log('✅ Login response:', res);

        this.authService.saveUserDetails(res);

        const storedToken = localStorage.getItem('token');
        console.log('🗝️ Stored token in localStorage:', storedToken);

        this.error = '';
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('❌ Login error:', err);
        this.error = 'Invalid login credentials. Please try again.';
      }
    });
  }
}
