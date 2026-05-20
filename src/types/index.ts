export interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
}

export interface SpendState {
  transactions: Transaction[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}
