import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction.model';
import { CategoryTotal, WeeklyTotal } from '../models/chart-data.model';

@Injectable({
  providedIn: 'root'
})
export class ChartDataService {
  constructor() {}

  /**
   * Calculate total amounts by category for expenses only
   */
  getCategoryTotals(transactions: Transaction[]): CategoryTotal[] {
    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        const existing = acc.find(c => c.category === t.category);
        if (existing) {
          existing.total += t.amount;
        } else {
          acc.push({ category: t.category, total: t.amount });
        }
        return acc;
      }, [] as CategoryTotal[]);

    return expensesByCategory.sort((a, b) => b.total - a.total);
  }

  /**
   * Calculate weekly income/expense totals
   */
  getWeeklyTotals(transactions: Transaction[]): WeeklyTotal[] {
    const weeklyMap = new Map<string, { income: number; expense: number }>();

    transactions.forEach(t => {
      const week = this.getWeekKey(t.date);
      if (!weeklyMap.has(week)) {
        weeklyMap.set(week, { income: 0, expense: 0 });
      }
      const weekly = weeklyMap.get(week)!;
      if (t.type === 'income') {
        weekly.income += t.amount;
      } else {
        weekly.expense += t.amount;
      }
    });

    const result: WeeklyTotal[] = Array.from(weeklyMap.entries()).map(([week, data]) => ({
      week,
      income: data.income,
      expense: data.expense,
      balance: data.income - data.expense
    }));

    return result.sort((a, b) => a.week.localeCompare(b.week));
  }

  /**
   * Get category totals formatted for pie chart
   */
  getCategoryChartData(transactions: Transaction[]): { labels: string[]; data: number[] } {
    const categoryTotals = this.getCategoryTotals(transactions);
    return {
      labels: categoryTotals.map(c => c.category),
      data: categoryTotals.map(c => c.total)
    };
  }

  /**
   * Get weekly totals formatted for line chart
   */
  getWeeklyChartData(transactions: Transaction[]): { labels: string[]; income: number[]; expense: number[] } {
    const weeklyTotals = this.getWeeklyTotals(transactions);
    return {
      labels: weeklyTotals.map(w => w.week),
      income: weeklyTotals.map(w => w.income),
      expense: weeklyTotals.map(w => w.expense)
    };
  }

  /**
   * Get ISO week key from date string (YYYY-MM-DD format)
   */
  private getWeekKey(dateString: string): string {
    const date = new Date(dateString);
    const weekNumber = this.getWeekNumber(date);
    const year = date.getFullYear();
    return `${year}-W${String(weekNumber).padStart(2, '0')}`;
  }

  /**
   * Calculate ISO week number
   */
  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }
}
