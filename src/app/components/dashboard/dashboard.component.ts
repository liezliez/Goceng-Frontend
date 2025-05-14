import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';


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

  constructor() {}

  ngOnInit(): void {}
}
