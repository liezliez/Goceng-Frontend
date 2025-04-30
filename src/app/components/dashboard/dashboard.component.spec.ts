import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

class MockAuthService {
  getUsername() {
    return 'Test User';
  }

  logout() {}
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: MockAuthService;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAuthService = new MockAuthService();

    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [DashboardComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;

    // Simulate default screen size (desktop)
    spyOnProperty(window, 'innerWidth').and.returnValue(1200);
    component.checkScreenSize();

    fixture.detectChanges();
  });

  it('should create the dashboard component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the username from AuthService', () => {
    expect(component.userName).toBe('Test User');
  });

  it('should toggle the sidebar open state on mobile', () => {
    component.isMobile = true;
    component.isSidebarOpen = false;
    component.toggleSidebar();
    expect(component.isSidebarOpen).toBeTrue();

    component.toggleSidebar();
    expect(component.isSidebarOpen).toBeFalse();
  });

  it('should toggle the sidebar collapsed state on desktop', () => {
    component.isMobile = false;
    component.isSidebarCollapsed = false;
    component.toggleSidebar();
    expect(component.isSidebarCollapsed).toBeTrue();

    component.toggleSidebar();
    expect(component.isSidebarCollapsed).toBeFalse();
  });

  it('should close sidebar on mobile', () => {
    component.isMobile = true;
    component.isSidebarOpen = true;
    component.closeSidebar();
    expect(component.isSidebarOpen).toBeFalse();
  });

  it('should not close sidebar on desktop', () => {
    component.isMobile = false;
    component.isSidebarOpen = true;
    component.closeSidebar();
    expect(component.isSidebarOpen).toBeTrue();
  });

  it('should call logout and navigate to login page', () => {
    spyOn(mockAuthService, 'logout');
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
//
