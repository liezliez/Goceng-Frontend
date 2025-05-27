import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [FormBuilder],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  token!: string;
  errorMessage = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Extract the reset token from the URL query parameters
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    // Display error if token is missing
    if (!this.token) {
      this.errorMessage = 'Token not found in URL';
      return;
    }

    // Initialize the password reset form with validation rules
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator to ensure both password fields match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  // Handle form submission to reset password
  onSubmit() {
    if (this.resetForm.invalid) {
      return;
    }

    const newPassword = this.resetForm.get('newPassword')?.value;

    // Send password reset request to the backend
    this.http.post(`${environment.apiUrl}/auth/reset-password`, {
      token: this.token,
      newPassword: newPassword
    }).subscribe({
      next: () => {
        // Clear any existing authentication tokens/session data
        localStorage.removeItem('auth_token');
        sessionStorage.clear();

        // Notify user of success and redirect after delay
        this.successMessage = 'Password reset successful. Redirecting to login page...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: err => {
        // Display error message returned from server
        this.errorMessage = err.error?.message || 'Failed to reset password.';
      }
    });
  }
}
