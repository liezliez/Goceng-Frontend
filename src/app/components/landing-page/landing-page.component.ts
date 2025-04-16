import { Component, OnInit } from '@angular/core';
import { LandingPageService } from '../../services/landing-page.service';  // Corrected path
import { CommonModule } from '@angular/common'; // Import CommonModule for structural directives
import { RouterModule } from '@angular/router'; // Import RouterModule for routing directives if needed

interface Stats {
  totalLoanDisbursed: string;
  appDownloads: string;
}

interface LoanOption {
  amount: string;
  duration: string;
}

interface Testimonial {
  name: string;
  age: number;
  amount: string;
  message: string;
}

@Component({
  standalone: true,  // Mark the component as standalone
  selector: 'app-landing-page',  // Define the selector for the component
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  imports: [CommonModule, RouterModule],  // Import CommonModule for directives like *ngFor and RouterModule for navigation
})
export class LandingPageComponent implements OnInit {
  stats: Stats = { totalLoanDisbursed: '', appDownloads: '' };
  loanOptions: LoanOption[] = [];
  testimonials: Testimonial[] = [];

  constructor(private landingService: LandingPageService) {}

  ngOnInit(): void {
    this.landingService.getStats().subscribe({
      next: (data: Stats) => this.stats = data,
      error: (err) => console.error('Error fetching stats', err)
    });

    this.landingService.getLoanOptions().subscribe({
      next: (data: LoanOption[]) => this.loanOptions = data,
      error: (err) => console.error('Error fetching loan options', err)
    });

    this.landingService.getTestimonials().subscribe({
      next: (data: Testimonial[]) => this.testimonials = data,
      error: (err) => console.error('Error fetching testimonials', err)
    });
  }
}
