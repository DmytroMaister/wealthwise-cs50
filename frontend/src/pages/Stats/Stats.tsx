import { useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { fetchExpenses } from '../../api/expensesApi';
import type { Expense } from '../Expenses/Expenses.types';
import './Stats.css';

export const Stats = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setError('');
        setLoading(true);
        const data = await fetchExpenses();
        setExpenses(data);
      } catch (err: any) {
        console.error(err);
        setError(err?.response?.data?.error ?? 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Total amount
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Group by category
  const byCategory: Record<string, number> = {};
  for (const e of expenses) {
    byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
  }

  return (
    <Box className="stats-page">
      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      ) : (
        <>
          <Typography variant="h5" className="stats-title">
            Statistics
          </Typography>

          <Paper className="stats-card">
            <Typography variant="subtitle2" color="text.secondary">
              Total expenses
            </Typography>
            <Typography variant="h4">${total.toFixed(2)}</Typography>
          </Paper>

          <Paper className="stats-card">
            <Typography variant="subtitle2" color="text.secondary">
              By category
            </Typography>

            {Object.keys(byCategory).length === 0 ? (
              <Typography variant="body2">No data</Typography>
            ) : (
              Object.entries(byCategory).map(([category, amount]) => (
                <Box key={category} className="stats-row">
                  <Typography>{category}</Typography>
                  <Typography fontWeight={500}>${amount.toFixed(2)}</Typography>
                </Box>
              ))
            )}
          </Paper>
        </>
      )}
    </Box>
  );
};
