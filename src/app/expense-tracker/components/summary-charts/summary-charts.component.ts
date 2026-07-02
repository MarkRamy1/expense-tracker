import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ExpenseService } from '../../services/expense.service';
import { ChartDataService } from '../../services/chart-data.service';
import { Transaction } from '../../models/transaction.model';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-summary-charts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary-charts.component.html',
  styleUrls: ['./summary-charts.component.scss']
})
export class SummaryChartsComponent implements OnInit, OnDestroy {
  @ViewChild('categoryChartCanvas', { static: false }) categoryChartCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('weeklyChartCanvas', { static: false }) weeklyChartCanvas?: ElementRef<HTMLCanvasElement>;

  categoryChart: Chart | null = null;
  weeklyChart: Chart | null = null;

  totalIncome = 0;
  totalExpenses = 0;
  balance = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private expenseService: ExpenseService,
    private chartDataService: ChartDataService
  ) {}

  ngOnInit(): void {
    // Subscribe to transaction changes
    this.expenseService.transactions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((transactions) => {
        this.updateCharts(transactions);
        this.updateTotals(transactions);
      });

    // Initialize charts with current data
    const transactions = this.expenseService.getTransactions();
    this.updateCharts(transactions);
    this.updateTotals(transactions);
  }

  ngAfterViewInit(): void {
    // Render charts after view is initialized (canvases are ready)
    const transactions = this.expenseService.getTransactions();
    this.renderCharts(transactions);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroyCharts();
  }

  private updateCharts(transactions: Transaction[]): void {
    if (this.categoryChartCanvas && this.weeklyChartCanvas) {
      this.renderCharts(transactions);
    }
  }

  private renderCharts(transactions: Transaction[]): void {
    if (transactions.length === 0) {
      console.warn('No transactions available for charts');
      return;
    }

    this.renderCategoryChart(transactions);
    this.renderWeeklyChart(transactions);
  }

  private renderCategoryChart(transactions: Transaction[]): void {
    if (!this.categoryChartCanvas) return;

    const chartData = this.chartDataService.getCategoryChartData(transactions);

    // Destroy existing chart
    if (this.categoryChart) {
      this.categoryChart.destroy();
    }

    const config: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: chartData.labels,
        datasets: [
          {
            data: chartData.data,
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
              '#FF9F40',
              '#C9CBCF'
            ],
            borderColor: '#fff',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'Expenses by Category'
          }
        }
      }
    };

    this.categoryChart = new Chart(this.categoryChartCanvas.nativeElement, config);
  }

  private renderWeeklyChart(transactions: Transaction[]): void {
    if (!this.weeklyChartCanvas) return;

    const chartData = this.chartDataService.getWeeklyChartData(transactions);

    // Destroy existing chart
    if (this.weeklyChart) {
      this.weeklyChart.destroy();
    }

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: 'Income',
            data: chartData.income,
            borderColor: '#4BC0C0',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            borderWidth: 2,
            fill: false,
            tension: 0.4
          },
          {
            label: 'Expenses',
            data: chartData.expense,
            borderColor: '#FF6384',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            borderWidth: 2,
            fill: false,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'Weekly Income vs Expenses'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };

    this.weeklyChart = new Chart(this.weeklyChartCanvas.nativeElement, config);
  }

  private updateTotals(transactions: Transaction[]): void {
    this.totalIncome = this.expenseService.getTotalIncome();
    this.totalExpenses = this.expenseService.getTotalExpenses();
    this.balance = this.expenseService.getBalance();
  }

  private destroyCharts(): void {
    if (this.categoryChart) {
      this.categoryChart.destroy();
    }
    if (this.weeklyChart) {
      this.weeklyChart.destroy();
    }
  }
}
