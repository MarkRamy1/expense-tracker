import { Routes } from '@angular/router';
import { ExpenseTrackerComponent } from './expense-tracker/expense-tracker.component';

export const routes: Routes = [
  {
    path: '',
    component: ExpenseTrackerComponent
  },
  {
    path: 'expenses',
    component: ExpenseTrackerComponent
  }
];
