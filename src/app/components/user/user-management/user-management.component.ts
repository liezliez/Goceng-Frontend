import { Component, OnInit, TemplateRef } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

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
  roles: { id: number; roleName: string }[] = [];
  loading = false;

  constructor(
    private userService: UserService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.userEditForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      accountStatus: ['', Validators.required],
      idRole: ['', Validators.required]  // role ID, number
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  
    this.userEditForm.get('idRole')?.valueChanges.subscribe(value => {
      console.log('Role dropdown changed to:', value);
    });
  }
  

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
        this.loading = false;
      },
      error: err => {
        console.error('Error fetching users', err);
        alert('Failed to load users.');
        this.loading = false;
      }
    });
  }

  loadRoles(): void {
    this.userService.getAllRoles().subscribe({
      next: (roles) => {
        this.roles = roles.map(role => ({
          id: role.id,
          roleName: role.roleName
        }));
        if (this.selectedUser) {
          this.patchForm(this.selectedUser);
        }
      },
      error: err => {
        console.error('Error fetching roles', err);
        alert('Failed to load roles.');
      }
    });
  }

  openEditModal(modal: TemplateRef<any>, user: User): void {
    this.userService.getUserById(user.id).subscribe({
      next: (userData) => {
        this.selectedUser = userData;
        if (this.roles.length > 0) {
          this.patchForm(userData);
        } else {
          this.loadRoles();  // roles will patch form after loaded
        }
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
      idRole: userData.role?.id ? String(userData.role.id) : '',
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
  
    console.log('Form raw values:', formValue);
    console.log('idRole as number:', Number(formValue.idRole));
  
    const payload = {
      name: formValue.name,
      email: formValue.email,
      account_status: formValue.accountStatus,
      idRole: Number(formValue.idRole),  // convert string to number explicitly
    };
  
    console.log('Payload to send:', payload);
  
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
}
