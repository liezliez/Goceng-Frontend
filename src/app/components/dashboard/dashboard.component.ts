import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FEATURE_BASED_MENU, MenuItem } from '../constants/menu/feature-menu';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  userName: string = 'User';
  userRole: string = 'Unknown Role';
  menuItems: MenuItem[] = [];

  isSidebarOpen: boolean = true;
  isSidebarCollapsed: boolean = false;
  isMobile: boolean = false;

  dashboardStats = [
    { title: 'Total Applications', value: 150, icon: 'bi-house-door', color: 'text-primary' },
    { title: 'Total Loans', value: 120, icon: 'bi-gear', color: 'text-success' },
    { title: 'Pending Approvals', value: 30, icon: 'bi-check-square', color: 'text-warning' },
    { title: 'Completed Repayments', value: 75, icon: 'bi-graph-up', color: 'text-info' }
  ];

  recentApplications = [
    { id: 1, customer: 'John Doe', loanAmount: 5000, status: 'Approved' },
    { id: 2, customer: 'Jane Smith', loanAmount: 3000, status: 'Pending' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 🧑‍💼 Load user info
    this.userName = this.authService.getUsername() ?? 'User';
    this.userRole = this.authService.getUserRole() ?? 'Unknown Role';

    // 📱 Adjust UI based on screen size
    this.checkScreenSize();

    // 🧩 Build menu based on available features
    const userFeatures = this.authService.getUserFeatures();
    this.menuItems = FEATURE_BASED_MENU
      .filter(item => userFeatures.includes(item.feature))
      .map(item => ({
        ...item,
        expanded: false, // Ensure expanded state is initially set
        children: item.children?.filter(child => userFeatures.includes(child.feature)) ?? []
      }));

    console.log(userFeatures); // Debugging line
  }

  @HostListener('window:resize', [])
  onResize(): void {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    const width = window.innerWidth;
    this.isMobile = width < 992;

    if (this.isMobile) {
      this.isSidebarOpen = false;
      this.isSidebarCollapsed = false;
    } else {
      this.isSidebarOpen = true;
    }
  }

  toggleSidebar(): void {
    if (this.isMobile) {
      this.isSidebarOpen = !this.isSidebarOpen;
    } else {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }
  }

  closeSidebar(): void {
    if (this.isMobile) {
      this.isSidebarOpen = false;
    }
  }

  // Toggle submenu visibility for the provided menu item
  toggleSubMenu(item: any): void {
    // Collapse all other open menus if needed
    this.menuItems.forEach(i => {
      if (i !== item) {
        i.expanded = false;
      }
    });

    // Toggle selected
    item.expanded = !item.expanded;
  }


  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  formatRole(role: string): string {
    if (!role) return '';
    return role
      .replace('ROLE_', '')
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  }
}
