import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../services/auth.service';
import { ApplicationService } from '../../services/application.service';
import { ApplicationResponse } from '../../models/application-response.model';

import { PaginationComponent } from '../../shared/pagination/pagination.component';

@Component({
  selector: 'app-application-approval',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModalModule,
    PaginationComponent
  ],
  templateUrl: './application-approval.component.html',
})
export class ApplicationApprovalComponent {
  private appService = inject(ApplicationService);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  applications: ApplicationResponse[] = [];
  selectedApp?: ApplicationResponse;
  userRole: string | null = null;

  form: FormGroup = this.fb.group({
    note: [''],
    isApproved: [true]
  });

  currentPage = 1;
  itemsPerPage = 5;

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    this.loadApplications();
  }

  loadApplications(): void {
    this.appService.getApplicationsByCurrentUserBranch()
      .subscribe((apps: ApplicationResponse[]) => this.applications = apps);
  }

  get paginatedApplications() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.applications.slice(start, start + this.itemsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  selectApplication(app: ApplicationResponse): void {
    this.selectedApp = app;
    this.form.reset({ isApproved: true, note: '' });
  }

  approve(): void {
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
      this.loadApplications();
    });
  }
}
