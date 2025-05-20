import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component'; // Main app component
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes'; // Import your routes
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';
import { registerLocaleData } from '@angular/common';
import localeId from '@angular/common/locales/id';

registerLocaleData(localeId);

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([AuthInterceptor])
    ),
    provideRouter(routes),
    provideAnimations(),
    {provide: localeId, useValue: 'id-ID'},
  ]
}).catch(err => console.error(err));
