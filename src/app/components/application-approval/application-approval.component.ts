import { Component, inject, TemplateRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalModule, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { ApplicationService } from '../../services/application.service';
import { ApplicationResponse } from '../../models/application-response.model';
import { CustomerResponse } from '../../models/customer-response.model';
import { CustomerService } from '../../services/customer.service';
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
export class ApplicationApprovalComponent implements OnInit {
  private appService = inject(ApplicationService);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private modalService = inject(NgbModal);
  private customerService = inject(CustomerService);

  applications: ApplicationResponse[] = [];
  selectedApp?: ApplicationResponse;
  selectedCustomer?: CustomerResponse;
  userRole: string | null = null;

  form: FormGroup = this.fb.group({
    note: [''],
    isApproved: [true]
  });

  modalInstance?: NgbModalRef;
  loading = false;

  currentPage = 1;
  itemsPerPage = 5;

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.loadApplications();
  }

  loadApplications(): void {
    this.appService.getApplicationsByCurrentUserBranch()
      .subscribe((apps: ApplicationResponse[]) => {
        this.applications = apps;
      });
  }

  openReviewModal(content: TemplateRef<any>): void {
    this.modalInstance = this.modalService.open(content, { size: 'lg' });
  }

  closeReviewModal(): void {
    this.modalInstance?.close();
  }

  get paginatedApplications(): ApplicationResponse[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.applications.slice(start, start + this.itemsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  selectApplication(app: ApplicationResponse, modalContent: TemplateRef<any>): void {
    this.selectedApp = app;
    this.form.reset({
      isApproved: true,
      note: ''
    });

    this.selectedCustomer = undefined;

    if (app.customerId) {
      this.customerService.getCustomerById(app.customerId).subscribe({
        next: (customer) => {
          this.selectedCustomer = customer;
        },
        error: (err) => {
          console.error('Failed to load customer', err);
          this.selectedCustomer = undefined;
        }
      });
    }

    this.modalInstance = this.modalService.open(modalContent, { centered: true, size: 'lg' });
  }

  approve(): void {
    if (!this.selectedApp || !this.userRole) return;

    const { isApproved, note } = this.form.value;
    const id = this.selectedApp.id;

    let approval$;

    switch (this.userRole) {
      case 'MARKETING':
        approval$ = this.appService.marketingApprove(id, isApproved, note);
        break;
      case 'BRANCH_MANAGER':
        approval$ = this.appService.branchManagerApprove(id, isApproved, note);
        break;
      case 'BACK_OFFICE':
        approval$ = this.appService.backOfficeApprove(id, isApproved, note);
        break;
      default:
        alert('You do not have approval rights.');
        return;
    }

    approval$.subscribe({
      next: () => {
        alert(`Application ${isApproved ? 'approved' : 'rejected'}!`);
        this.selectedApp = undefined;
        this.form.reset();
        this.loadApplications();
        this.modalInstance?.close();
      },
      error: (err) => {
        let message = 'Approval failed.';

        if (err.error && typeof err.error === 'string') {
          message = err.error;
        } else if (err.status === 409) {
          message = 'This application is not in the correct status for approval.';
        } else if (err.status === 403) {
          message = 'You are not authorized to perform this action.';
        }

        alert(message);
      }
    });
  }
}
