import { Component, OnInit, HostListener, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';  // <-- import UserService here
import {
  FEATURE_BASED_MENU,
  MenuItem,
} from '../../components/constants/menu/feature-menu';

declare var bootstrap: any;

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit, AfterViewInit {
  userName: string = 'User';
  userRole: string = 'Unknown Role';
  formattedRole: string = '';
  userBranch: string = 'N/A';

  menuItems: MenuItem[] = [];

  isSidebarOpen: boolean = true;
  isSidebarCollapsed: boolean = false;
  isMobile: boolean = false;

  @ViewChild('noAppsToast') noAppsToast!: ElementRef;

  constructor(
    private authService: AuthService,
    private userService: UserService,  // <-- inject UserService
    private router: Router
  ) {}

  ngOnInit(): void {
    // Fetch full user profile from backend
    this.userService.getUserProfile().subscribe({
      next: user => {
        this.userName = user.name ?? 'User';
        this.userRole = user.role?.roleName ?? 'Unknown Role';
        this.formattedRole = this.formatRole(this.userRole);
        this.userBranch = user.branch?.name ?? 'N/A';

        // Optionally update local storage user cache
        localStorage.setItem('user', JSON.stringify(user));
      },
      error: err => {
        console.error('Failed to fetch user profile', err);
        // fallback to authService if needed:
        this.userName = this.authService.getUsername() ?? 'User';
        this.userRole = this.authService.getUserRole() ?? 'Unknown Role';
        this.userBranch = this.authService.getUserBranch() ?? 'N/A';
        this.formattedRole = this.formatRole(this.userRole);
      }
    });

    this.checkScreenSize();

    const userFeatures = this.authService.getUserFeatures();
    console.log('User Features:', userFeatures);

    this.menuItems = FEATURE_BASED_MENU.filter((item) =>
      userFeatures.includes(item.feature)
    ).map((item) => ({
      ...item,
      expanded: false,
      children:
        item.children?.filter((child) =>
          userFeatures.includes(child.feature)
        ) ?? [],
    }));

    console.log('Filtered Menu Items:', this.menuItems);

    if (this.menuItems.length === 0) {
      setTimeout(() => this.showNoAppsToast(), 100);
    }
  }

  ngAfterViewInit(): void {}

  showNoAppsToast(): void {
    const toastEl = this.noAppsToast?.nativeElement;
    if (toastEl) {
      const toast = new bootstrap.Toast(toastEl, {
        delay: 3000,
      });
      toast.show();
    }
  }

  @HostListener('window:load')
  @HostListener('window:orientationchange')
  @HostListener('window:resize')
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

  toggleSubMenu(item: MenuItem): void {
    this.menuItems.forEach((i) => {
      if (i !== item) {
        i.expanded = false;
      }
    });

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
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
