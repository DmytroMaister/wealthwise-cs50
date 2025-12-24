import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/Login/Login';
import { Register } from '../pages/Register/Register';
import { Home } from '../pages/Home/Home';
import { MainLayout } from '../components/MainLayout/MainLayout';
import type { User } from '../types/commonTypes';
import { Expenses } from '../pages/Expenses/Expenses';
import { Stats } from '../pages/Stats/Stats';
import { Profile } from '../pages/Profile/Profile';
import { fetchUser } from '../api/profileApi';
import { Typography } from '@mui/material';

export const App = () => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  // Check current user on app load
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchUser();
        setUser(data.user);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return loading ? (
    <Typography>Loading...</Typography>
  ) : (
    <Routes>
      {/* Home page */}
      <Route
        path="/"
        element={
          user ? (
            <MainLayout user={user} onLogout={() => setUser(null)}>
              <Home />
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Expenses page */}
      <Route
        path="/expenses"
        element={
          user ? (
            <MainLayout user={user} onLogout={() => setUser(null)}>
              <Expenses />
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Stats page */}
      <Route
        path="/stats"
        element={
          user ? (
            <MainLayout user={user} onLogout={() => setUser(null)}>
              <Stats />
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Profile page */}
      <Route
        path="/profile"
        element={
          user ? (
            <MainLayout user={user} onLogout={() => setUser(null)}>
              <Profile />
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Public routes */}
      <Route path="/login" element={<Login onLoggedIn={setUser} />} />
      <Route path="/register" element={<Register onLoggedIn={setUser} />} />

      {/* Fallback */}
      <Route
        path="*"
        element={<Navigate to={user ? '/' : '/login'} replace />}
      />
    </Routes>
  );
};
