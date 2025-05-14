import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { TemplateRef } from '@angular/core';
import { User } from '../../../models/user.model';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModalModule]
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  userEditForm: FormGroup;
  roles: { id: string; name: string }[] = [];

  constructor(
    private userService: UserService,
    private http: HttpClient,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.userEditForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      accountStatus: ['ACTIVE', Validators.required],
      idRole: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data: User[]) => this.users = data,
      error: (err) => console.error('Error fetching users', err)
    });
  }

  loadRoles(): void {
    this.userService.getAllRoles().subscribe({
      next: (roles) => {
        this.roles = roles.map(role => ({
          id: role.id,
          name: role.roleName
        }));
      },
      error: (err) => console.error('Error fetching roles', err)
    });
  }

  openEditModal(modal: TemplateRef<any>, user: User): void {
    this.selectedUser = user;

    this.userEditForm.patchValue({
      name: user.name,
      email: user.email,
      password: '',
      accountStatus: user.accountStatus,
      idRole: user.role?.idRole || ''
    });

    this.modalService.open(modal, { centered: true });
  }

  openCreateModal(modal: TemplateRef<any>): void {
    this.selectedUser = null;
    this.userEditForm.reset({
      name: '',
      email: '',
      password: '',
      accountStatus: 'ACTIVE',
      idRole: ''
    });
    this.modalService.open(modal, { centered: true });
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  onRoleChange(event: any): void {
    const selectedRole = event.target.value;
    console.log('Selected role:', selectedRole);
  }

  saveUserEdits(): void {
    if (this.userEditForm.invalid) {
      alert('Please complete all required fields.');
      return;
    }

    const formValue = this.userEditForm.value;
    const payload: any = {
      name: formValue.name,
      email: formValue.email,
      accountStatus: formValue.accountStatus,
      role: { id: formValue.idRole }
    };

    if (formValue.password?.trim()) {
      payload.password = formValue.password;
    }

    if (this.selectedUser) {
      this.userService.editUser(this.selectedUser.idUser, payload).subscribe({
        next: () => {
          alert('User updated successfully!');
          this.userEditForm.reset();
          this.selectedUser = null;
          this.modalService.dismissAll();
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error updating user', error);
          alert('Failed to update user.');
        }
      });
    } else {
      // Optional: You can handle user creation here
      alert('User creation not implemented yet.');
    }
  }

  softDeleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.softDeleteUser(userId).subscribe({
        next: () => this.loadUsers(),
        error: (err) => console.error('Error deleting user', err)
      });
    }
  }

  restoreUser(userId: string): void {
    if (confirm('Are you sure you want to restore this user?')) {
      this.userService.restoreUser(userId).subscribe({
        next: () => this.loadUsers(),
        error: (err) => console.error('Error restoring user', err)
      });
    }
  }
}
