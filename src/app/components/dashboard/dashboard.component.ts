import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule, BaseChartDirective]
})
export class DashboardComponent implements OnInit {

  news = [
    { title: 'Migrasi core system telah selesai', description: 'Kami beritahukan bahwa proses migrasi telah dilaksanakan oleh tim IT.' },
    { title: 'Feature baru: Auto Disburse', description: 'Disbursed telah bisa dilakukan secara otomatis.' },
    { title: 'Ganti password Juni', description: 'Jangan terlewat untuk mengganti password periode Juni 2025.' },
  ];

  totalUsers = 0;
  totalUsersOverall = 0;
  totalApplications = 0;

  pieChartData: ChartData<'pie'> = {
    labels: ['Users in Branch', 'Other Users'],
    datasets: [{ data: [0, 0], backgroundColor: ['#28a745', '#d3d3d3'] }]
  };

  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: { enabled: true }
    }
  };

  constructor(private userService: UserService, private http: HttpClient) {}

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe({
      next: (user) => {
        const branchId = user.branch?.id;
        if (!branchId) {
          console.error('Branch ID not found');
          return;
        }
        this.loadBranchSummary(branchId);
      },
      error: (err) => console.error('Profile error', err)
    });
  }

  loadBranchSummary(branchId: string): void {
    this.http.get<any>(`${environment.apiUrl}/dashboard/branch-summary?branchId=${branchId}`)
      .subscribe({
        next: (data) => {
          this.totalUsers = data.branchUsers;
          this.totalApplications = data.totalApplications;
          this.totalUsersOverall = data.totalUsersOverall;

          const otherUsers = this.totalUsersOverall - this.totalUsers;

          this.pieChartData = {
            labels: ['User cabang anda', 'User cabang lain'],
            datasets: [{
              data: [this.totalUsers, otherUsers],
              backgroundColor: ['#28a745', '#d3d3d3']
            }]
          };
        },
        error: (err) => console.error('Dashboard summary error', err)
      });
  }
}
