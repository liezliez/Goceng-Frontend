import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardComponent ],
      imports: [ CommonModule, RouterModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the welcome message', () => {
    const welcomeElement = fixture.debugElement.query(By.css('.welcome-section h1'));
    expect(welcomeElement.nativeElement.textContent).toContain('Welcome to Goceng Dashboard');
  });

  it('should display news items', () => {
    const newsItems = fixture.debugElement.queryAll(By.css('.news-item'));
    expect(newsItems.length).toBeGreaterThan(0);
  });

  it('should display news title and description correctly', () => {
    const firstNewsItem = fixture.debugElement.query(By.css('.news-item'));
    const title = firstNewsItem.query(By.css('.news-title')).nativeElement.textContent;
    const description = firstNewsItem.query(By.css('.news-description')).nativeElement.textContent;

    expect(title).toBe('New Loan Application System');
    expect(description).toBe('We have updated our loan application process for a better experience.');
  });

  it('should display the GIF image', () => {
    const gifImage = fixture.debugElement.query(By.css('.welcome-gif')).nativeElement;
    expect(gifImage.src).toContain('giphy.com');
  });
});
