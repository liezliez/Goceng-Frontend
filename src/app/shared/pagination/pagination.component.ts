import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  standalone: true,
  imports: [CommonModule] 
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() totalItems = 0;
  @Input() itemsPerPage = 3;

  @Output() pageChanged = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  pages(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.pageChanged.emit(page);
  }
}
