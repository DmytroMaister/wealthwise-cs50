import { useState, type FC } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Link,
} from '@mui/material';
import { login } from '../../api/authApi';
import { links } from '../../utils/links';

import './Login.css';
import type { User } from '../../types/commonTypes';

export const Login: FC<{ onLoggedIn: (user: User) => void }> = ({
  onLoggedIn,
}) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(username, password);
      onLoggedIn(user);
      navigate('/', { replace: true });
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.error ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Card className="login-card">
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>

          {error && <p className="error">{error}</p>}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Username"
              autoComplete="off"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
              fullWidth
              autoComplete="off"
              label="Password"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              Login
            </Button>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 2, textAlign: 'center' }}
            >
              Don't have an account?{' '}
              <Link component={RouterLink} to={links.register}>
                Register
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};
