import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';

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
    fixture.detectChanges();
  });

  it('should create the dashboard component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the username', () => {
    expect(component.userName).toBe('Test User');
  });

  it('should toggle the sidebar open state', () => {
    expect(component.isSidebarOpen).toBeFalse();
    component.toggleSidebar();
    expect(component.isSidebarOpen).toBeTrue();
  });

  it('should toggle the sidebar collapse state', () => {
    expect(component.isSidebarCollapsed).toBeFalse();
    component.toggleSidebarCollapse();
    expect(component.isSidebarCollapsed).toBeTrue();
  });

  it('should call logout method and navigate to login page', () => {
    component.logout();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
