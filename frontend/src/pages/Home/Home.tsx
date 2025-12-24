import { useEffect, useState } from 'react';
import { Box, Paper, Typography, Divider } from '@mui/material';
import { fetchExpenses } from '../../api/expensesApi';
import type { Expense } from '../Expenses/Expenses.types';
import './Home.css';

export const Home = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load expenses on mount
  useEffect(() => {
    const load = async () => {
      try {
        setError('');
        setLoading(true);

        // Fetch expenses from API
        const data = await fetchExpenses();
        setExpenses(data);
      } catch (err: any) {
        console.error(err);
        setError(err?.response?.data?.error ?? 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Date helpers
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const monthPrefix = today.slice(0, 7); // YYYY-MM

  // Totals
  let totalAll = 0;
  let totalMonth = 0;
  let totalToday = 0;

  // Take latest 5 expenses
  const latest = expenses.slice(0, 5);

  // Calculate totals
  for (const e of expenses) {
    totalAll += e.amount;

    if (e.spent_at?.startsWith(monthPrefix)) {
      totalMonth += e.amount;
    }

    if (e.spent_at === today) {
      totalToday += e.amount;
    }
  }

  return loading ? (
    <Typography>Loading...</Typography>
  ) : error ? (
    <Typography color="error" variant="body2">
      {error}
    </Typography>
  ) : (
    <Box className="home-page">
      {/* Page title */}
      <Typography variant="h5" className="home-title">
        Dashboard
      </Typography>

      {/* Summary cards */}
      <Box className="home-cards">
        <Paper className="home-card">
          <Typography variant="subtitle2" color="text.secondary">
            Today
          </Typography>
          <Typography variant="h5">${totalToday.toFixed(2)}</Typography>
          <Typography variant="caption" color="text.secondary">
            {today}
          </Typography>
        </Paper>

        <Paper className="home-card">
          <Typography variant="subtitle2" color="text.secondary">
            This month
          </Typography>
          <Typography variant="h5">${totalMonth.toFixed(2)}</Typography>
          <Typography variant="caption" color="text.secondary">
            {monthPrefix}
          </Typography>
        </Paper>

        <Paper className="home-card">
          <Typography variant="subtitle2" color="text.secondary">
            Total
          </Typography>
          <Typography variant="h5">${totalAll.toFixed(2)}</Typography>
          <Typography variant="caption" color="text.secondary">
            All time
          </Typography>
        </Paper>
      </Box>

      {/* Recent expenses */}
      <Paper className="home-section">
        <Typography variant="subtitle2" color="text.secondary">
          Recent expenses
        </Typography>

        <Divider className="home-divider" />

        {latest.length === 0 ? (
          <Typography variant="body2">No expenses yet.</Typography>
        ) : (
          <Box className="home-list">
            {latest.map((e) => (
              <Box key={e.id} className="home-row">
                <Box className="home-row-left">
                  <Typography className="home-row-title">
                    {e.category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {e.description || '—'}
                  </Typography>
                </Box>

                <Box className="home-row-right">
                  <Typography fontWeight={600}>
                    ${e.amount.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {e.spent_at}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
};
