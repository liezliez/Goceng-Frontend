import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service'; // Service for authentication and token management

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changeForm!: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService // Inject authentication service
  ) {}

  ngOnInit(): void {
    // Initialize the form with validation rules
    this.changeForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  /**
   * Custom validator to ensure newPassword and confirmPassword fields match
   */
  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  /**
   * Handles form submission for password change
   */
  onSubmit() {
    if (this.changeForm.invalid) return;

    const token = this.authService.getToken();
    console.log('Token from AuthService:', token);

    const formData = {
      oldPassword: this.changeForm.get('oldPassword')?.value,
      newPassword: this.changeForm.get('newPassword')?.value
    };

    this.http.post(
      `${environment.apiUrl}/users/change-password`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    ).subscribe({
      next: () => {
        this.successMessage = 'Password changed successfully. Please login again.';
        this.authService.logout();
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: err => {
        this.errorMessage = err.error?.message || 'Failed to change password.';
      }
    });
  }

}
