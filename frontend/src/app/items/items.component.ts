import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { ItemsService } from '../core/services/items.service';
import { Item, PaginatedResponse } from '../core/models/item.model';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss'
})
export class ItemsComponent implements OnInit, OnDestroy {
  private itemsService = inject(ItemsService);
  private authService = inject(AuthService);
  
  // RxJS Subject for takeUntil pattern - prevents memory leaks
  private destroy$ = new Subject<void>();

  items = signal<Item[]>([]);
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  totalDocs = signal<number>(0);
  limit = signal<number>(10);
  hasNextPage = signal<boolean>(false);
  hasPrevPage = signal<boolean>(false);
  errorMessage = signal<string>('');

  isLoading = this.itemsService.isLoading;
  user = this.authService.user;

  pageSizeOptions = [5, 10, 20, 50];

  ngOnInit(): void {
    this.loadItems();
  }

  // Cleanup subscriptions on component destroy to prevent memory leaks
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadItems(): void {
    this.errorMessage.set('');
    
    // Using takeUntil to automatically unsubscribe when component is destroyed
    this.itemsService.getItems(this.currentPage(), this.limit())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PaginatedResponse<Item>) => {
          this.items.set(response.docs);
          this.totalPages.set(response.totalPages);
          this.totalDocs.set(response.totalDocs);
          this.hasNextPage.set(response.hasNextPage);
          this.hasPrevPage.set(response.hasPrevPage);
        },
        error: (error) => {
          this.errorMessage.set(error.error?.message || 'Failed to load items');
        }
      });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadItems();
    }
  }

  nextPage(): void {
    if (this.hasNextPage()) {
      this.currentPage.update(p => p + 1);
      this.loadItems();
    }
  }

  prevPage(): void {
    if (this.hasPrevPage()) {
      this.currentPage.update(p => p - 1);
      this.loadItems();
    }
  }

  onLimitChange(): void {
    this.currentPage.set(1);
    this.loadItems();
  }

  logout(): void {
    this.authService.logout();
  }
}
