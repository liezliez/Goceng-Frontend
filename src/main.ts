import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component'; // Main app component
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes'; // Import your routes
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), // Optional, if you want to use HttpClient
    provideRouter(routes) // Provide the routing configuration
  ]
}).catch(err => console.error(err));
