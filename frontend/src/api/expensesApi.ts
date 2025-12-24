import type { Expense } from '../pages/Expenses/Expenses.types';
import { del, get, post, put } from './api';

export const fetchExpenses = () => get('/api/expenses');

export const createExpense = (payload: Expense) =>
  post('/api/expenses', payload);

export const updateExpense = (id: number, payload: Expense) =>
  put(`/api/expenses/${id}`, payload);

export const deleteExpense = (id: number) => del(`/api/expenses/${id}`);
