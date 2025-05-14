import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { TemplateRef } from '@angular/core';
import { User } from '../../../models/user.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,NgbModalModule]
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  userEditForm: FormGroup;
  roles: { id: string; name: string }[] = []; // Holds dropdown role options

  constructor(
    private userService: UserService,
    private http: HttpClient,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.userEditForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''], // No required validator for password
      accountStatus: ['ACTIVE', Validators.required],
      idRole: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(
      (data: User[]) => this.users = data,
      (error) => console.error('Error fetching users', error)
    );
  }

  loadRoles(): void {
    this.userService.getAllRoles().subscribe(
      (roles) => {
        this.roles = roles.map(role => ({
          id: role.id,
          name: role.roleName // Adjust depending on your backend
        }));
      },
      (error) => console.error('Error fetching roles', error)
    );
  }

  openEditModal(modal: TemplateRef<any>, user: any): void {
    console.log('Opening modal for user', user);
    this.selectedUser = user;

    this.userEditForm.patchValue({
      name: user.name,
      email: user.email,
      password: '',
      accountStatus: user.accountStatus,
      idRole: user.role.id
    });

    this.modalService.open(modal, { centered: true });
  }
  openCreateModal(modal: TemplateRef<any>): void {
    this.selectedUser = null; // Reset selected user for creating a new user
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
    console.log('Save button clicked');

    if (!this.selectedUser) {
      console.warn('No selected user');
      return;
    }

    if (this.userEditForm.invalid) {
      console.warn('Form is invalid');
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

    console.log('Payload being sent:', payload);

    this.userService.editUser(this.selectedUser.idUser, payload).subscribe({
      next: () => {
        alert('User updated successfully!');
        this.modalService.dismissAll(); // ✅ Close modal
        this.loadUsers(); // ✅ Refresh list
      },
      error: (error) => {
        console.error('Error updating user', error);
        alert('Failed to update user.');
      }
    });


    // Only add password to the payload if it's provided
    if (formValue.password?.trim()) {
      payload.password = formValue.password;
    }

    if (!this.selectedUser) return;

    this.userService.editUser(this.selectedUser.idUser, payload).subscribe({
      next: () => {
        alert('User updated successfully!');
        this.userEditForm.reset(); // ✅ Clear the form
        this.selectedUser = null; // ✅ Clear the selected user
        this.loadUsers(); // ✅ Refresh the user list
        this.modalService.dismissAll(); // ✅ Close the modal
      },
      error: (error) => {
        console.error('Error updating user', error);
        alert('Failed to update user.');
      }
    });
  }

  softDeleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.softDeleteUser(userId).subscribe(
        () => this.loadUsers(),
        (error) => console.error('Error deleting user', error)
      );
    }
  }

  restoreUser(userId: string): void {
    if (confirm('Are you sure you want to restore this user?')) {
      this.userService.restoreUser(userId).subscribe(
        () => this.loadUsers(),
        (error) => console.error('Error restoring user', error)
      );
    }
  }
}
