import {
  Component,
  OnInit,
  HostListener,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
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

  menuItems: MenuItem[] = [];

  isSidebarOpen: boolean = true;
  isSidebarCollapsed: boolean = false;
  isMobile: boolean = false;

  @ViewChild('noAppsToast') noAppsToast!: ElementRef;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userName = this.authService.getUsername() ?? 'User';
    this.userRole = this.authService.getUserRole() ?? 'Unknown Role';
    this.formattedRole = this.formatRole(this.userRole);

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
      // Use slight delay to ensure the view initializes before toast is shown
      setTimeout(() => this.showNoAppsToast(), 100);
    }
  }

  ngAfterViewInit(): void {}

  showNoAppsToast(): void {
    const toastEl = this.noAppsToast?.nativeElement;
    if (toastEl) {
      const toast = new bootstrap.Toast(toastEl, {
        delay: 3000, // Auto-hide after 3 seconds
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
