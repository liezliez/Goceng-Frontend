import { Component, OnInit, TemplateRef } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { Branch } from '../../../models/branch.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModalModule, FormsModule]
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  selectedUser: User | null = null;
  searchText: string = '';
  userEditForm: FormGroup;
  roles = [
    { id: 1, roleName: 'ROLE_SUPERADMIN' },
    { id: 5, roleName: 'ROLE_BACK_OFFICE' },
    { id: 4, roleName: 'ROLE_BRANCH_MANAGER' },
    { id: 3, roleName: 'ROLE_MARKETING' },
    { id: 2, roleName: 'ROLE_CUSTOMER' }
  ];
  branches: Branch[] = [];

  loading = false;
  currentPage = 1;
  itemsPerPage = 20;

  constructor(
    private userService: UserService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.userEditForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      accountStatus: ['', Validators.required],
      idRole: ['', Validators.required],
      branchId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadBranches();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
        this.filteredUsers = data;
        this.loading = false;
      },
      error: err => {
        console.error('Error fetching users', err);
        alert('Failed to load users.');
        this.loading = false;
      }
    });
  }

  loadBranches(): void {
    this.userService.getAllBranches().subscribe({
      next: (branches: Branch[]) => this.branches = branches,
      error: err => console.error(err)
    });
  }

  applyFilter(): void {
    const keyword = this.searchText.toLowerCase().trim();
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword) ||
      (user.role?.roleName?.toLowerCase().includes(keyword) ?? false)
    );
    this.currentPage = 1;
  }

  openEditModal(modal: TemplateRef<any>, user: User): void {
    this.userService.getUserById(user.id).subscribe({
      next: (userData) => {
        this.selectedUser = userData;
        this.patchForm(userData);
        this.modalService.open(modal, { centered: true });
      },
      error: (err) => {
        console.error('Failed to load user details', err);
        alert('Failed to load user details for editing.');
      }
    });
  }

  patchForm(userData: User): void {
    this.userEditForm.patchValue({
      name: userData.name,
      email: userData.email,
      accountStatus: userData.account_status,
      idRole: userData.role?.id || '',
      branchId: userData.branch?.id || ''
    });
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  saveUserEdits(): void {
    if (this.userEditForm.invalid) {
      alert('Please fill all required fields correctly.');
      return;
    }

    const formValue = this.userEditForm.getRawValue();
    const payload = {
      name: formValue.name,
      email: formValue.email,
      account_status: formValue.accountStatus,
      idRole: formValue.idRole,
      id_branch: formValue.branchId
    };

    if (this.selectedUser) {
      this.loading = true;
      this.userService.editUser(this.selectedUser.id, payload).subscribe({
        next: () => {
          alert('User updated successfully!');
          this.userEditForm.reset();
          this.selectedUser = null;
          this.loadUsers();
          this.modalService.dismissAll();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error updating user', err);
          alert('Failed to update user.');
          this.loading = false;
        }
      });
    } else {
      alert('No user selected for editing.');
    }
  }

  softDeleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.softDeleteUser(userId).subscribe({
        next: (res) => {
          alert(res);
          this.loadUsers();
        },
        error: err => {
          console.error('Error deleting user', err);
          alert('Failed to delete user.');
        }
      });
    }
  }

  restoreUser(userId: string): void {
    if (confirm('Are you sure you want to restore this user?')) {
      this.loading = true;
      this.userService.restoreUser(userId).subscribe({
        next: (res) => {
          alert(res);
          this.loadUsers();
          this.loading = false;
        },
        error: err => {
          console.error('Error restoring user', err);
          alert('Failed to restore user.');
          this.loading = false;
        }
      });
    }
  }

  get paginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, startIndex + this.itemsPerPage);
  }

  totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage = page;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage = page;
    }
  }
}
