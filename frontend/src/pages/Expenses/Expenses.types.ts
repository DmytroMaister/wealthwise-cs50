export type Expense = {
  id: number;
  amount: number;
  category: string;
  description: string;
  spent_at: string;
};

export type ExpenseAction = 'new' | 'edit' | null;
