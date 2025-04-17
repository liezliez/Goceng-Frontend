import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'] // Ensure this file exists
})
export class DashboardComponent implements OnInit {
  userName: string | undefined; // To hold the user's name

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUsername();
    if (user) {
      this.userName = user;
    }
  }



  /**
   * Logout the user by calling the AuthService logout method
   * and then redirecting to the login page.
   */
  logout(): void {
    this.authService.logout(); // Call AuthService to logout and handle token blacklisting
    this.router.navigate(['/login']); // Redirect to login page after logout
  }
}
