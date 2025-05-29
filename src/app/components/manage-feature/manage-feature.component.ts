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
  constructor(private featureService: RoleFeatureService) {}

  featureForm = new FormGroup({
    roleName: new FormControl('', Validators.required),
    featureName: new FormControl('', Validators.required)
  });

  featureList = signal<string[]>([]);
  resultMessage = signal<string | null>(null);

  loadCurrentUserFeatures() {
    this.featureService.getFeaturesForCurrentUser().subscribe({
      next: (features) => this.featureList.set(features),
      error: (err) => {
        const message = typeof err.error === 'string' ? err.error : JSON.stringify(err.error);
        this.resultMessage.set(message);
      }
    });
  }

  assignFeature() {
    const { roleName, featureName } = this.featureForm.value;
    if (roleName && featureName) {
      this.featureService.addFeatureToRole(roleName, featureName).subscribe({
        next: (res: any) => {
          const message = typeof res === 'string' ? res : JSON.stringify(res);
          this.resultMessage.set(message);
          this.loadCurrentUserFeatures();
        },
        error: (err) => {
          const message = typeof err.error === 'string' ? err.error : JSON.stringify(err.error);
          this.resultMessage.set(message);
        }
      });
    }
  }

  removeFeature() {
    const { roleName, featureName } = this.featureForm.value;
    if (roleName && featureName) {
      this.featureService.removeFeatureFromRole(roleName, featureName).subscribe({
        next: (res: any) => {
          const message = typeof res === 'string' ? res : JSON.stringify(res);
          this.resultMessage.set(message);
          this.loadCurrentUserFeatures();
        },
        error: (err) => {
          const message = typeof err.error === 'string' ? err.error : JSON.stringify(err.error);
          this.resultMessage.set(message);
        }
      });
    }
  }

  checkFeature() {
    const { roleName, featureName } = this.featureForm.value;
    if (roleName && featureName) {
      this.featureService.hasFeature(roleName, featureName).subscribe({
        next: (res: any) => {
          const message = typeof res === 'string' ? res : JSON.stringify(res);
          this.resultMessage.set(message);
        },
        error: (err) => {
          const message = typeof err.error === 'string' ? err.error : JSON.stringify(err.error);
          this.resultMessage.set(message);
        }
      });
    }
  }

  ngOnInit() {
    this.loadCurrentUserFeatures();
  }
}
