import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Branch } from '../../models/branch.model';
import { BranchService } from '../../services/branch.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-branch-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './branch-management.component.html',
  styleUrls: ['./branch-management.component.scss']
})
export class BranchManagementComponent implements OnInit {
  branches: Branch[] = [];
  selectedBranch: Branch | null = null;
  searchText = '';
  branchForm: FormGroup;
  currentPage = 1;
  itemsPerPage = 10;

  constructor(
    private fb: FormBuilder,
    public modalService: NgbModal,
    private branchService: BranchService
  ) {
    this.branchForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadBranches();
  }

  loadBranches(): void {
    this.branchService.getAllBranches().subscribe({
      next: (branches) => (this.branches = branches),
      error: () => alert('Failed to load branches')
    });
  }

  get filteredBranches(): Branch[] {
    const keyword = this.searchText.toLowerCase();
    return this.branches.filter(
      (b) =>
        b.name.toLowerCase().includes(keyword) ||
        b.city.toLowerCase().includes(keyword) ||
        b.province.toLowerCase().includes(keyword)
    );
  }

  get paginatedBranches(): Branch[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredBranches.slice(start, start + this.itemsPerPage);
  }

  totalPages(): number {
    return Math.ceil(this.filteredBranches.length / this.itemsPerPage);
  }

  openModal(modal: TemplateRef<any>, branch?: Branch): void {
    if (branch) {
      this.selectedBranch = branch;
      this.branchForm.patchValue(branch);
    } else {
      this.selectedBranch = null;
      this.branchForm.reset();
    }
    this.modalService.open(modal, { centered: true });
  }

  saveBranch(): void {
    if (this.branchForm.invalid) {
      alert('Please fill all required fields.');
      return;
    }
    const data = this.branchForm.value;
    if (this.selectedBranch) {
      this.branchService.updateBranch(this.selectedBranch.id, data).subscribe({
        next: () => {
          alert('Branch updated!');
          this.loadBranches();
          this.modalService.dismissAll();
        },
        error: () => alert('Failed to update branch.')
      });
    } else {
      this.branchService.createBranch(data).subscribe({
        next: () => {
          alert('Branch created!');
          this.loadBranches();
          this.modalService.dismissAll();
        },
        error: () => alert('Failed to create branch.')
      });
    }
  }

  deleteBranch(id: string): void {
    if (confirm('Are you sure to delete this branch?')) {
      this.branchService.deleteBranch(id).subscribe({
        next: () => {
          alert('Branch deleted!');
          this.loadBranches();
        },
        error: () => alert('Failed to delete branch.')
      });
    }
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage = page;
    }
  }
}
