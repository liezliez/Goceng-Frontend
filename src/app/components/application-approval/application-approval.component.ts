import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ApplicationService, ApplicationResponse } from '../../services/application.service';

@Component({
  selector: 'app-application-approval',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModalModule],  // <---- Add ReactiveFormsModule here
  templateUrl: './application-approval.component.html',
})
export class ApplicationApprovalComponent {
  private appService = inject(ApplicationService);
  private fb = inject(FormBuilder);

  applications: ApplicationResponse[] = [];
  selectedApp?: ApplicationResponse;
  form: FormGroup = this.fb.group({
    note: [''],
    isApproved: [true]
  });

  ngOnInit() {
    this.appService.getAll().subscribe(apps => this.applications = apps);
  }

  selectApplication(app: ApplicationResponse) {
    this.selectedApp = app;
    this.form.reset({ isApproved: true, note: '' });
  }

  approve(role: 'marketing' | 'branch-manager' | 'back-office') {
    if (!this.selectedApp) return;

    const { isApproved, note } = this.form.value;
    const id = this.selectedApp.id;
    let approval$: any;

    switch (role) {
      case 'marketing':
        approval$ = this.appService.marketingApprove(id, isApproved, note);
        break;
      case 'branch-manager':
        approval$ = this.appService.branchManagerApprove(id, isApproved, note);
        break;
      case 'back-office':
        approval$ = this.appService.backOfficeApprove(id, isApproved, note);
        break;
    }

    approval$.subscribe(() => {
      alert(`Application ${isApproved ? 'approved' : 'rejected'}!`);
      this.selectedApp = undefined;
      this.appService.getAll().subscribe(apps => this.applications = apps);
    });
  }
}
