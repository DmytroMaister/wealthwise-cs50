import { useEffect, useState, type FC } from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { createExpense, updateExpense } from '../../api/expensesApi';
import { CATEGORIES, emptyExpense } from './ExpensesForm.utils';
import type { ExpensesFormProps } from './ExpensesForm.types';
import type { Expense } from '../../pages/Expenses/Expenses.types';
import './ExpensesForm.css';

export const ExpensesForm: FC<ExpensesFormProps> = ({
  onClose,
  onConfirm,
  edit,
}) => {
  const [expense, setExpense] = useState<Expense>(emptyExpense);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Initialize form when edit changes
  useEffect(() => {
    if (edit) {
      setExpense(edit); // edit mode
    } else {
      setExpense(emptyExpense); // create mode
    }
    setError('');
  }, [edit]);

  // Simple client-side validation
  const validate = () => {
    if (!expense.amount || expense.amount <= 0) {
      return 'Amount must be a positive number';
    }
    if (!expense.category.trim()) {
      return 'Category is required';
    }
    if (!expense.spent_at) {
      return 'Date is required';
    }
    return '';
  };

  // Create or update expense
  const handleSave = async () => {
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);

      // Decide between create or update
      const saved = edit
        ? await updateExpense(expense.id, expense)
        : await createExpense(expense);

      // Notify parent
      onConfirm(saved);

      // Reset form only for create
      if (!edit) {
        setExpense(emptyExpense);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.error ?? 'Failed to save expense');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="expenses-form-wrapper">
      {/* Error message */}
      {error && (
        <Typography variant="body2" className="expense-error">
          {error}
        </Typography>
      )}

      {/* Amount */}
      <TextField
        fullWidth
        label="Amount"
        type="number"
        margin="normal"
        value={expense.amount ?? ''}
        onChange={(e) =>
          setExpense((prev) => ({
            ...prev,
            amount: Number(e.target.value),
          }))
        }
      />

      {/* Category (required) */}
      <FormControl fullWidth margin="normal">
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          label="Category"
          value={expense.category}
          onChange={(e) =>
            setExpense((prev) => ({
              ...prev,
              category: String(e.target.value),
            }))
          }
        >
          {CATEGORIES.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Description */}
      <TextField
        fullWidth
        label="Description (optional)"
        margin="normal"
        value={expense.description || ''}
        onChange={(e) =>
          setExpense((prev) => ({
            ...prev,
            description: e.target.value,
          }))
        }
      />

      {/* Date */}
      <TextField
        fullWidth
        label="Date"
        type="date"
        margin="normal"
        value={expense.spent_at}
        onChange={(e) =>
          setExpense((prev) => ({
            ...prev,
            spent_at: e.target.value,
          }))
        }
      />

      {/* Actions */}
      <div className="expenses-form-actions">
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : edit ? 'Update' : 'Save'}
        </Button>
      </div>
    </div>
  );
};
