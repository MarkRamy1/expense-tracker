import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ExpenseService } from '../../services/expense.service';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit, OnDestroy {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  filterType: 'all' | 'income' | 'expense' = 'all';
  sortBy: 'date' | 'amount' = 'date';
  sortOrder: 'asc' | 'desc' = 'desc';

  private destroy$ = new Subject<void>();

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.expenseService.transactions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((transactions) => {
        this.transactions = transactions;
        this.applyFiltersAndSort();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  deleteTransaction(id: string): void {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.expenseService.deleteTransaction(id);
    }
  }

  onFilterChange(type: 'all' | 'income' | 'expense'): void {
    this.filterType = type;
    this.applyFiltersAndSort();
  }

  onSortChange(field: 'date' | 'amount'): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'desc';
    }
    this.applyFiltersAndSort();
  }

  private applyFiltersAndSort(): void {
    let filtered = [...this.transactions];

    // Filter by type
    if (this.filterType !== 'all') {
      filtered = filtered.filter((t) => t.type === this.filterType);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;

      if (this.sortBy === 'date') {
        comparison = a.date.localeCompare(b.date);
      } else if (this.sortBy === 'amount') {
        comparison = a.amount - b.amount;
      }

      return this.sortOrder === 'asc' ? comparison : -comparison;
    });

    this.filteredTransactions = filtered;
  }

  getTypeClass(type: 'income' | 'expense'): string {
    return type === 'income' ? 'income' : 'expense';
  }

  getTypeLabel(type: 'income' | 'expense'): string {
    return type === 'income' ? '+ Income' : '- Expense';
  }

  formatCurrency(amount: number, type: 'income' | 'expense'): string {
    const sign = type === 'income' ? '+' : '-';
    return `${sign}$${amount.toFixed(2)}`;
  }
}
