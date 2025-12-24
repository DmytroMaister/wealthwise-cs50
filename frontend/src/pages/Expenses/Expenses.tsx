import { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { deleteExpense, fetchExpenses } from '../../api/expensesApi';
import { WiseDataGrid } from '../../components/WiseDataGrid/WiseDataGrid';
import { ExpensesForm } from '../../components/ExpensesForm/ExpensesForm';
import { WiseDialog } from '../../components/WiseDialog/WiseDialog';
import type { Expense, ExpenseAction } from './Expenses.types';
import { expensesHeader } from './Expenses.utils';
import './Expenses.css';

export const Expenses = () => {
  const [open, setOpen] = useState<ExpenseAction>(null);
  const [expenseEdit, setExpenseEdit] = useState<Expense | null>();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [pageError, setPageError] = useState('');
  const [loadingList, setLoadingList] = useState(true);
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const getExpenses = async () => {
    try {
      setPageError('');
      setLoadingList(true);
      const data = await fetchExpenses();
      setExpenses(data);
    } catch (err: any) {
      console.error(err);
      setPageError(err?.response?.data?.error ?? 'Failed to load expenses');
    } finally {
      setLoadingList(false);
    }
  };

  // Load expenses on mount
  useEffect(() => {
    getExpenses();
  }, []);

  // Handle create / update success
  const handleConfirm = () => {
    setOpen(null);
    getExpenses();
  };

  // Close dialog and reset edit state
  const handleClose = () => {
    setExpenseEdit(null);
    setOpen(null);
  };

  // Open edit dialog with selected row
  const handleEdit = (row: Expense) => {
    setExpenseEdit(row);
    setOpen('edit');
  };

  // Delete expense
  const handleDelete = async (id: number) => {
    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      console.error(err);
      setPageError(err?.response?.data?.error ?? 'Failed to delete expense');
    }
  };

  // DataGrid columns
  const header = expensesHeader(handleDelete, handleEdit);

  return (
    <Box className="expenses-page">
      {/* Page header */}
      <Box className="expenses-header">
        <Box className="expenses-title">
          <Typography variant="h5" className="expenses-h1">
            Expenses
          </Typography>
          <Typography variant="body2" className="expenses-total">
            Total: ${total.toFixed(2)}
          </Typography>
        </Box>

        {/* Open create dialog */}
        <Button variant="contained" onClick={() => setOpen('new')}>
          Add Expense
        </Button>
      </Box>

      {/* Page error */}
      {pageError && (
        <Typography variant="body2" className="expenses-page-error">
          {pageError}
        </Typography>
      )}

      {/* Expenses table */}
      <WiseDataGrid
        columns={header}
        rows={expenses}
        loading={loadingList}
        noRowsLabel="No expenses yet"
      />

      {/* Create expense dialog */}
      <WiseDialog
        open={open === 'new'}
        onClose={handleClose}
        title="Add Expense"
        fullWidth
      >
        <ExpensesForm onClose={handleClose} onConfirm={handleConfirm} />
      </WiseDialog>

      {/* Edit expense dialog */}
      <WiseDialog
        open={open === 'edit'}
        onClose={handleClose}
        title="Edit Expense"
        fullWidth
      >
        <ExpensesForm
          onClose={handleClose}
          onConfirm={handleConfirm}
          edit={expenseEdit}
        />
      </WiseDialog>
    </Box>
  );
};
