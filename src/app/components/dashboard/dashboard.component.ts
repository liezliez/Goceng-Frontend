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
    { title: 'Migrasi core system telah selesai', description: 'Kami beritahukan bahwa proses migrasi telah dilaksanakan oleh tim IT.' },
    { title: 'Feature baru: Auto Disburse', description: 'Disbursed telah bisa dilakukan secara otomatis.' },
    { title: 'Ganti password Juni', description: 'Jangan terlewat untuk mengganti password periode Juni 2025.' },
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
