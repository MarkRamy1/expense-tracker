import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'expense_tracker_transactions';

  constructor() {}

  /**
   * Load all transactions from localStorage
   */
  loadTransactions(): Transaction[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load transactions from storage:', error);
      return [];
    }
  }

  /**
   * Save transactions to localStorage
   */
  saveTransactions(transactions: Transaction[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error('Failed to save transactions to storage:', error);
    }
  }

  /**
   * Clear all transactions from storage
   */
  clearTransactions(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
}
