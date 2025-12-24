import type { Expense } from '../../pages/Expenses/Expenses.types';

export const CATEGORIES = [
  'Food',
  'Groceries',
  'Transport',
  'Fuel',
  'Rent',
  'Utilities',
  'Internet & Phone',
  'Subscriptions',
  'Shopping',
  'Health',
  'Insurance',
  'Entertainment',
  'Travel',
  'Education',
  'Gifts',
  'Other',
];

export const emptyExpense: Expense = {
  id: 0,
  amount: 0,
  category: 'Food',
  description: '',
  spent_at: new Date().toISOString().slice(0, 10),
};
