import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ApplicationService } from '../../services/application.service';
import { ApplicationResponse } from '../../models/application-response.model';

import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-application-approval',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModalModule],
  templateUrl: './application-approval.component.html',
})
export class ApplicationApprovalComponent {
  private appService = inject(ApplicationService);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  applications: ApplicationResponse[] = [];
  selectedApp?: ApplicationResponse;
  form: FormGroup = this.fb.group({
    note: [''],
    isApproved: [true]
  });
  userRole: string | null = null;

  ngOnInit() {
    this.userRole = this.authService.getUserRole();

    // Assuming your backend supports filtering by branch/userId:
    // If you have user id or branch id in token, pass it here.
    this.appService.getApplicationsByCurrentUserBranch().subscribe(apps => this.applications = apps);
  }

  selectApplication(app: ApplicationResponse) {
    this.selectedApp = app;
    this.form.reset({ isApproved: true, note: '' });
  }

  approve() {
    if (!this.selectedApp || !this.userRole) return;

    const { isApproved, note } = this.form.value;
    const id = this.selectedApp.id;

    let approval$;

    switch (this.userRole) {
      case 'ROLE_MARKETING':
        approval$ = this.appService.marketingApprove(id, isApproved, note);
        break;
      case 'ROLE_BRANCH_MANAGER':
        approval$ = this.appService.branchManagerApprove(id, isApproved, note);
        break;
      case 'ROLE_BACK_OFFICE':
        approval$ = this.appService.backOfficeApprove(id, isApproved, note);
        break;
      default:
        alert('You do not have approval rights.');
        return;
    }

    approval$.subscribe(() => {
      alert(`Application ${isApproved ? 'approved' : 'rejected'}!`);
      this.selectedApp = undefined;
      this.appService.getApplicationsByCurrentUserBranch()
      .subscribe((apps: ApplicationResponse[]) => this.applications = apps);
    });
  }
}
