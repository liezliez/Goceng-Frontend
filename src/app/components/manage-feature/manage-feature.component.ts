import { Component, OnInit, signal } from '@angular/core';
import { RoleFeatureService } from '../../services/role-feature.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-manage-feature',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './manage-feature.component.html',
  providers: [RoleFeatureService],
})
export class ManageFeatureComponent implements OnInit {
  featureForm = new FormGroup({
    roleName: new FormControl('', Validators.required),
  });

  roleList = signal<string[]>([]);
  assignedFeatures = signal<string[]>([]);
  unassignedFeatures = signal<string[]>([]);
  resultMessage = signal<string | null>(null);

  selectedFeature: string | null = null;
  selectedTable: 'assigned' | 'unassigned' | null = null;

  loading = signal<boolean>(false);

  constructor(private featureService: RoleFeatureService) {}

  ngOnInit() {
    this.loadRoles();
    this.loadCurrentUserFeatures();
  }

  private formatError(err: any): string {
    return typeof err.error === 'string' ? err.error : JSON.stringify(err.error);
  }

  loadRoles() {
    this.loading.set(true);
    this.featureService.getAllRoles().subscribe({
      next: (roles) => {
        const roleNames = roles.map(role => role.roleName);
        this.roleList.set(roleNames);
        this.loading.set(false);
      },
      error: (err) => {
        this.resultMessage.set(`Failed to load roles: ${this.formatError(err)}`);
        this.loading.set(false);
      },
    });
  }

  selectFeature(feature: string, table: 'assigned' | 'unassigned') {
    this.selectedFeature = feature;
    this.selectedTable = table;
  }

  onRoleChange() {
    const role = this.featureForm.value.roleName;
    if (role) {
      this.loadFeaturesForRole(role);
    } else {
      // Clear features if no role selected
      this.assignedFeatures.set([]);
      this.unassignedFeatures.set([]);
      this.selectedFeature = null;
      this.selectedTable = null;
    }
  }

  loadFeaturesForRole(role: string) {
    this.resultMessage.set(null);
    this.loading.set(true);

    this.featureService.getAllFeatures().subscribe({
      next: (allFeatures) => {
        this.featureService.getFeaturesByRole(role).subscribe({
          next: (assigned) => {
            this.assignedFeatures.set(assigned);
            const unassigned = allFeatures.filter(f => !assigned.includes(f));
            this.unassignedFeatures.set(unassigned);
            this.selectedFeature = null;
            this.selectedTable = null;
            this.loading.set(false);
          },
          error: (err) => {
            this.resultMessage.set(this.formatError(err));
            this.loading.set(false);
          },
        });
      },
      error: (err) => {
        this.resultMessage.set(this.formatError(err));
        this.loading.set(false);
      },
    });
  }

  assignFeature() {
    const role = this.featureForm.value.roleName;
    const feature = this.selectedFeature;
    if (role && feature && this.selectedTable === 'unassigned') {
      this.loading.set(true);
      this.featureService.addFeatureToRole(role, feature).subscribe({
        next: () => {
          this.loadFeaturesForRole(role);
          // Do NOT set loading false here, loadFeaturesForRole handles it
        },
        error: (err) => {
          this.resultMessage.set(this.formatError(err));
          this.loading.set(false);
        },
      });
    }
  }

  removeFeature() {
    const role = this.featureForm.value.roleName;
    const feature = this.selectedFeature;
    if (role && feature && this.selectedTable === 'assigned') {
      this.loading.set(true);
      this.featureService.removeFeatureFromRole(role, feature).subscribe({
        next: () => {
          this.loadFeaturesForRole(role);
          // Do NOT set loading false here, loadFeaturesForRole handles it
        },
        error: (err) => {
          this.resultMessage.set(this.formatError(err));
          this.loading.set(false);
        },
      });
    }
  }


  loadCurrentUserFeatures() {
    this.featureService.getFeaturesForCurrentUser().subscribe({
      next: () => {
        this.resultMessage.set(null);
      },
      error: (err) => {
        this.resultMessage.set(this.formatError(err));
      }
    });
  }
}
