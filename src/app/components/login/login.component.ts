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

        this.error = '';
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.error = 'Invalid login credentials. Please try again.';
      }
    });
  }
}
