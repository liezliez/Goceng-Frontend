import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { ROLES } from '../../constants/roles';

interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  latitude: number;
  longitude: number;
  childBranches: Branch[];
}

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-user.component.html'
})
export class CreateUserComponent implements OnInit {
  public ROLES = ROLES;
  createUserForm!: FormGroup;
  roles = [
    { label: 'Super Admin', value: ROLES.SUPERADMIN },
    { label: 'Back Office', value: ROLES.BACK_OFFICE },
    { label: 'Branch Manager', value: ROLES.BRANCH_MANAGER },
    { label: 'Marketing', value: ROLES.MARKETING },
    { label: 'Customer', value: ROLES.CUSTOMER }
  ];
  branches: Branch[] = [];
  successMessage = '';
  errorMessage = '';
  loading = false;

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.createUserForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required],
      branchId: ['', Validators.required]
    });

    this.fetchBranches();
  }

  fetchBranches(): void {
    this.userService.getAllBranches().subscribe({
      next: (branches: Branch[]) => this.branches = branches,
      error: (err) => console.error('Failed to load branches', err)
    });
  }

  onRoleChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const role = selectElement.value;

    const branchControl = this.createUserForm.get('branchId');
    if (role === ROLES.SUPERADMIN) {
      branchControl?.clearValidators();
      branchControl?.setValue('');
    } else {
      branchControl?.setValidators([Validators.required]);
    }
    branchControl?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.createUserForm.invalid) return;

    this.loading = true;
    const { name, email, password, role, branchId } = this.createUserForm.value;

    this.userService.createEmployeeWithRole(role, { name, email, password, branchId }).subscribe({
      next: () => {
        this.successMessage = 'User created successfully!';
        this.errorMessage = '';
        this.createUserForm.reset();
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to create user.';
        this.successMessage = '';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
