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
  error: string = ''; // This will store the error message

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.authRequest).subscribe({
      next: (res) => {
        this.authService.saveUserDetails(res);
        this.error = ''; // Clear any previous error message
        console.log('Login successful:', res); // Log the response for debugging
        this.router.navigate(['/dashboard']); // Redirect after login
      },
      error: (err) => {
        // Display a generic error message for invalid credentials
        this.error = 'Invalid login credentials. Please try again.';
      }
    });
  }
}
