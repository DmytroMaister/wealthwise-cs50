import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/Login/Login';
import { Register } from '../pages/Register/Register';
import { Home } from '../pages/Home/Home';
import { fetchUser } from '../api/authApi';
import { MainLayout } from '../components/MainLayout/MainLayout';
import type { User } from '../types/commonTypes';

export const App = () => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchUser();
        const data = await res.json();
        setUser(data.user);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return loading ? (
    'Loading ...'
  ) : (
    <Routes>
      <Route path="/login" element={<Login onLoggedIn={setUser} />} />
      <Route path="/register" element={<Register onLoggedIn={setUser} />} />

      <Route
        path="/"
        element={
          user ? (
            <MainLayout user={user} onLogout={() => setUser(null)}>
              <Home user={user} />
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="*"
        element={<Navigate to={user ? '/' : '/login'} replace />}
      />
    </Routes>
  );
};
