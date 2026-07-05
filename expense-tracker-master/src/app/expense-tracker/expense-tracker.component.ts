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
    <div class="expense-tracker-app">
      <!-- Background elements for glassmorphism look -->
      <div class="bg-shape shape-1"></div>
      <div class="bg-shape shape-2"></div>
      <div class="bg-shape shape-3"></div>

      <div class="app-wrapper">
        <header class="app-header glass-panel">
          <div class="header-content">
            <div class="logo-container">
              <span class="logo-icon">✨</span>
              <h1>Expense Tracker</h1>
            </div>
            <p>Smart financial management</p>
          </div>
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
    </div>
  `,
  styles: [`
    .expense-tracker-app {
      min-height: 100vh;
      position: relative;
      overflow: hidden;
    }

    /* Abstract background shapes */
    .bg-shape {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      z-index: 0;
      opacity: 0.6;
    }

    .shape-1 {
      top: -10%;
      left: -5%;
      width: 40vw;
      height: 40vw;
      background: rgba(59, 130, 246, 0.3); /* Blue accent */
    }

    .shape-2 {
      bottom: -10%;
      right: -5%;
      width: 50vw;
      height: 50vw;
      background: rgba(139, 92, 246, 0.25); /* Purple accent */
    }

    .shape-3 {
      top: 40%;
      left: 50%;
      width: 30vw;
      height: 30vw;
      background: rgba(16, 185, 129, 0.15); /* Green accent */
      transform: translate(-50%, -50%);
    }

    .app-wrapper {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .app-header {
      margin: 1.5rem auto;
      width: calc(100% - 3rem);
      max-width: 1400px;
      padding: 1.5rem 2rem;
      border-radius: var(--border-radius-lg);
      background: rgba(30, 41, 59, 0.5); /* extra transparent */
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;

      .logo-container {
        display: flex;
        align-items: center;
        gap: 0.75rem;

        .logo-icon {
          font-size: 2rem;
          background: var(--accent-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        h1 {
          margin: 0;
          font-size: 1.75rem;
          font-weight: 700;
          background: linear-gradient(to right, #fff, #cbd5e1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }

      p {
        margin: 0;
        color: var(--text-secondary);
        font-weight: 500;
        font-size: 0.95rem;
      }
    }

    .container {
      flex: 1;
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1.5rem 2rem 1.5rem;
    }

    .layout {
      display: grid;
      grid-template-columns: 350px 1fr;
      gap: 2rem;
      align-items: start;
    }

    .sidebar {
      position: sticky;
      top: 1.5rem;
    }

    .main-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      min-width: 0; /* Prevent grid blowout */
    }

    @media (max-width: 1024px) {
      .layout {
        grid-template-columns: 1fr;
      }
      .sidebar {
        position: relative;
        top: 0;
      }
    }

    @media (max-width: 768px) {
      .app-header {
        margin: 1rem;
        width: calc(100% - 2rem);
        padding: 1.25rem;
      }

      .header-content {
        flex-direction: column;
        align-items: flex-start;
      }

      .container {
        padding: 0 1rem 1rem 1rem;
      }

      .layout {
        gap: 1.5rem;
      }
      
      .main-content {
        gap: 1.5rem;
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
