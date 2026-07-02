import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private transactions: Transaction[] = [];
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);

  /**
   * Observable stream of transactions — subscribe to react to changes
   */
  public transactions$ = this.transactionsSubject.asObservable();

  constructor(private storageService: StorageService) {
    this.loadTransactions();
  }

  /**
   * Load transactions from storage on init
   */
  private loadTransactions(): void {
    this.transactions = this.storageService.loadTransactions();
    this.transactionsSubject.next([...this.transactions]);
  }

  /**
   * Get all transactions (snapshot)
   */
  getTransactions(): Transaction[] {
    return [...this.transactions];
  }

  /**
   * Add a new transaction
   */
  addTransaction(transaction: Omit<Transaction, 'id'>): Transaction {
    const newTransaction: Transaction = {
      ...transaction,
      id: this.generateId()
    };
    this.transactions.push(newTransaction);
    this.persist();
    return newTransaction;
  }

  /**
   * Update an existing transaction
   */
  updateTransaction(id: string, updates: Partial<Transaction>): boolean {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index === -1) return false;

    this.transactions[index] = { ...this.transactions[index], ...updates };
    this.persist();
    return true;
  }

  /**
   * Delete a transaction by ID
   */
  deleteTransaction(id: string): boolean {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index === -1) return false;

    this.transactions.splice(index, 1);
    this.persist();
    return true;
  }

  /**
   * Get total balance (income - expenses)
   */
  getBalance(): number {
    return this.transactions.reduce((sum, t) => {
      const amount = t.type === 'income' ? t.amount : -t.amount;
      return sum + amount;
    }, 0);
  }

  /**
   * Get total income
   */
  getTotalIncome(): number {
    return this.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  /**
   * Get total expenses
   */
  getTotalExpenses(): number {
    return this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  /**
   * Private: generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Private: persist changes to storage and emit
   */
  private persist(): void {
    this.storageService.saveTransactions(this.transactions);
    this.transactionsSubject.next([...this.transactions]);
  }
}
