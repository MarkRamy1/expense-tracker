import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryChartsComponent } from './components/summary-charts/summary-charts.component';
import { ExpenseFormComponent } from './components/expense-form/expense-form.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { ExpenseService } from './services/expense.service';
import { Transaction } from './models/transaction.model';

@Component({
  selector: 'app-expense-tracker',
  standalone: true,
  imports: [CommonModule, SummaryChartsComponent, ExpenseFormComponent, TransactionListComponent],
  template: `
    <div class="expense-tracker">
      <header>
        <h1>💰 Expense Tracker</h1>
        <p>Track your income and expenses with beautiful charts</p>
      </header>
      <main class="container">
        <div class="layout">
          <!-- Left: Form -->
          <aside class="sidebar">
            <app-expense-form></app-expense-form>
          </aside>

          <!-- Right: Charts and List -->
          <div class="main-content">
            <app-summary-charts></app-summary-charts>
            <app-transaction-list></app-transaction-list>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .expense-tracker {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    header {
      text-align: center;
      color: white;
      padding: 2rem 1rem;
      background: rgba(0, 0, 0, 0.1);

      h1 {
        margin: 0;
        font-size: 2rem;
      }

      p {
        margin: 0.5rem 0 0 0;
        opacity: 0.9;
      }
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .layout {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 2rem;
    }

    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .main-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    @media (max-width: 1024px) {
      .layout {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      header h1 {
        font-size: 1.5rem;
      }

      .container {
        padding: 1rem;
      }
    }
  `]
})
export class ExpenseTrackerComponent implements OnInit {
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
