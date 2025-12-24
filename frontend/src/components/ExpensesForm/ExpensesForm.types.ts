import type { Expense } from '../../pages/Expenses/Expenses.types';

export interface ExpensesFormProps {
  onClose: () => void;
  onConfirm: (saved: Expense) => void;
  edit?: Expense | null;
}
