import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Dashboard stats array to display in the template
  dashboardStats = [
    { title: 'Total Applications', value: 150, icon: 'bi-house-door', color: 'text-primary' },
    { title: 'Total Loans', value: 120, icon: 'bi-gear', color: 'text-success' },
    { title: 'Pending Approvals', value: 30, icon: 'bi-check-square', color: 'text-warning' },
    { title: 'Completed Repayments', value: 75, icon: 'bi-graph-up', color: 'text-info' }
  ];

  // User and sidebar properties
  userName: string | undefined;
  isSidebarOpen: boolean = true;
  isSidebarCollapsed: boolean = false;
  isMobile: boolean = false;

  // Recent applications
  recentApplications = [
    { id: 1, customer: 'John Doe', loanAmount: 5000, status: 'Approved' },
    { id: 2, customer: 'Jane Smith', loanAmount: 3000, status: 'Pending' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUsername();
    this.userName = user ?? undefined;
    this.checkScreenSize();
  }

  @HostListener('window:resize', [])
  onResize(): void {
    this.checkScreenSize();
  }

  // Check if the screen size is mobile or not
  checkScreenSize(): void {
    this.isMobile = window.innerWidth < 992;
    if (this.isMobile) {
      this.isSidebarOpen = false; // Collapse sidebar on mobile
    }
  }

  // Toggle sidebar state based on device type (mobile vs desktop)
  toggleSidebar(): void {
    if (this.isMobile) {
      this.isSidebarOpen = !this.isSidebarOpen;  // Toggle open/close on mobile
    } else {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;  // Collapse/Expand on desktop
    }
  }

  // Method to collapse/expand the sidebar on desktop
  toggleSidebarCollapse(): void {
    if (!this.isMobile) {
      this.isSidebarCollapsed = !this.isSidebarCollapsed; // Toggle collapse on desktop
    }
  }

  // Logout user and navigate to login page
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Close the sidebar explicitly
  closeSidebar(): void {
    this.isSidebarOpen = false;
  }
}
