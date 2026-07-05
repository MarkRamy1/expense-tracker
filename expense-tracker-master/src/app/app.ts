import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryChartsComponent } from './expense-tracker/components/summary-charts/summary-charts.component';
import { ExpenseFormComponent } from './expense-tracker/components/expense-form/expense-form.component';
import { TransactionListComponent } from './expense-tracker/components/transaction-list/transaction-list.component';
import { ExpenseService } from './expense-tracker/services/expense.service';
import { Transaction } from './expense-tracker/models/transaction.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SummaryChartsComponent, ExpenseFormComponent, TransactionListComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('expense-tracker');

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    // Initialize with sample data if storage is empty
    const transactions = this.expenseService.getTransactions();
    if (transactions.length === 0) {
      this.seedSampleData();
    }
  }

  /**
   * Seed sample data for demonstration
   */
  private seedSampleData(): void {
    const today = new Date();
    const sampleTransactions: Omit<Transaction, 'id'>[] = [
      {
        date: this.dateToISO(new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)),
        description: 'Grocery Shopping',
        amount: 45.50,
        category: 'Food',
        type: 'expense'
      },
      {
        date: this.dateToISO(new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)),
        description: 'Monthly Salary',
        amount: 3000,
        category: 'Salary',
        type: 'income'
      },
      {
        date: this.dateToISO(new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000)),
        description: 'Gas',
        amount: 55,
        category: 'Transport',
        type: 'expense'
      },
      {
        date: this.dateToISO(new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000)),
        description: 'Electricity Bill',
        amount: 120,
        category: 'Utilities',
        type: 'expense'
      },
      {
        date: this.dateToISO(new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000)),
        description: 'Restaurant',
        amount: 35.75,
        category: 'Food',
        type: 'expense'
      },
      {
        date: this.dateToISO(new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000)),
        description: 'Movie Tickets',
        amount: 25,
        category: 'Entertainment',
        type: 'expense'
      },
      {
        date: this.dateToISO(new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)),
        description: 'Pharmacy',
        amount: 40,
        category: 'Healthcare',
        type: 'expense'
      },
      {
        date: this.dateToISO(new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)),
        description: 'Dinner',
        amount: 60,
        category: 'Food',
        type: 'expense'
      },
      {
        date: this.dateToISO(new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)),
        description: 'Freelance Work',
        amount: 500,
        category: 'Salary',
        type: 'income'
      },
      {
        date: this.dateToISO(today),
        description: 'Coffee',
        amount: 5.50,
        category: 'Food',
        type: 'expense'
      }
    ];

    sampleTransactions.forEach(t => {
      this.expenseService.addTransaction(t);
    });
  }

  /**
   * Convert Date to ISO string (YYYY-MM-DD)
   */
  private dateToISO(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
