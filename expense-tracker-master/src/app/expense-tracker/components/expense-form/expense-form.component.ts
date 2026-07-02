import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExpenseService } from '../../services/expense.service';
import { Transaction, TransactionCategory } from '../../models/transaction.model';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.scss']
})
export class ExpenseFormComponent implements OnInit {
  categories: TransactionCategory[] = [
    'Food',
    'Transport',
    'Utilities',
    'Entertainment',
    'Healthcare',
    'Salary',
    'Other'
  ];

  formData = {
    date: this.getToday(),
    description: '',
    amount: 0,
    category: 'Food' as TransactionCategory,
    type: 'expense' as 'income' | 'expense'
  };

  submitted = false;
  editingId: string | null = null;

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.submitted = true;

    if (!this.isFormValid()) {
      return;
    }

    if (this.editingId) {
      // Update existing
      this.expenseService.updateTransaction(this.editingId, {
        date: this.formData.date,
        description: this.formData.description,
        amount: this.formData.amount,
        category: this.formData.category,
        type: this.formData.type
      });
    } else {
      // Add new
      this.expenseService.addTransaction({
        date: this.formData.date,
        description: this.formData.description,
        amount: this.formData.amount,
        category: this.formData.category,
        type: this.formData.type
      });
    }

    this.resetForm();
  }

  resetForm(): void {
    this.formData = {
      date: this.getToday(),
      description: '',
      amount: 0,
      category: 'Food',
      type: 'expense'
    };
    this.submitted = false;
    this.editingId = null;
  }

  isFormValid(): boolean {
    return (
      this.formData.date.trim() !== '' &&
      this.formData.description.trim() !== '' &&
      this.formData.amount > 0
    );
  }

  private getToday(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
}
