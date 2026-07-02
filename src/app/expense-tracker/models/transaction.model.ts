export interface Transaction {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  description: string;
  amount: number; // absolute value, always positive
  category: string; // e.g., 'Food', 'Transport', 'Utilities', 'Salary', etc.
  type: 'income' | 'expense'; // determines sign when calculating totals
}

export type TransactionCategory = 'Food' | 'Transport' | 'Utilities' | 'Entertainment' | 'Healthcare' | 'Salary' | 'Other';
