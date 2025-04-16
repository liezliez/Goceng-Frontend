import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },  // Default route for landing page
  // Add additional routes here, e.g., { path: 'signup', component: SignUpComponent }
  { path: '**', redirectTo: '' }  // Wildcard route for undefined paths
];
