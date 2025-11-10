export interface Customer {
  name: string;
  service: string;
  price: number;
}

export interface SalesRecord {
  id: string;
  date: string;
  totalSales: number;
  customers: Customer[];
  timestamp: number;
}

export interface ExpenseRecord {
  id: string;
  date: string;
  amount: number;
  notes: string;
  timestamp: number;
}

export interface DailySummary {
  totalSales: number;
  totalExpenses: number;
  netProfit: number;
}
