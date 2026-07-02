export interface CategoryTotal {
  category: string;
  total: number;
}

export interface DailyTotal {
  date: string; // ISO date string
  income: number;
  expense: number;
  balance: number;
}

export interface WeeklyTotal {
  week: string; // format: "2024-W01" or "Week of Jan 1"
  income: number;
  expense: number;
  balance: number;
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}
