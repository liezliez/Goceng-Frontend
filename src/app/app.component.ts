import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule for standalone components

@Component({
  selector: 'app-root',
  standalone: true, // Mark this as a standalone component
  imports: [CommonModule,RouterModule], // Import CommonModule to use Angular directives
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Goceng';
}
