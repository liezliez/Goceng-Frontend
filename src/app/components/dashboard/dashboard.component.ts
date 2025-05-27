import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule]
})
export class DashboardComponent implements OnInit {
  news = [
    { title: 'New Loan Application System', description: 'We have updated our loan application process for a better experience.' },
    { title: 'Feature Release: Auto Repayment', description: 'The new auto repayment feature is now available to all users.' },
    { title: 'Customer Support Hours', description: 'Our customer support team is available 24/7 to assist you.' },
  ];

  totalUsers: number = 0;
  totalApplications: number = 0;

  constructor(private userService: UserService, private http: HttpClient) {}

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe({
      next: (user) => {
        const branchId = user.branch?.id;
        if (!branchId) {
          console.error('Branch ID not found on user profile');
          return;
        }

        this.loadBranchSummary(branchId);
      },
      error: (err) => {
        console.error('Failed to load user profile', err);
      }
    });
  }

  loadBranchSummary(branchId: string): void {
    this.http.get<any>(`${environment.apiUrl}/dashboard/branch-summary?branchId=${branchId}`)
      .subscribe({
        next: (data) => {
          this.totalUsers = data.totalUsers;
          this.totalApplications = data.totalApplications;
        },
        error: (err) => {
          console.error('Failed to load dashboard summary', err);
        }
      });
  }
}
