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
import { register } from '../../api/authApi';
import { links } from '../../utils/links';
import type { User } from '../../types/commonTypes';

import '../Login/Login.css';

export const Register: FC<{ onLoggedIn: (user: User) => void }> = ({
  onLoggedIn,
}) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await register(username, password, confirm);
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
            Register
          </Typography>

          {error && <p className="error">{error}</p>}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <TextField
              fullWidth
              label="Confirm password"
              type="password"
              margin="normal"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              Register
            </Button>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 2, textAlign: 'center' }}
            >
              Already have an account?{' '}
              <Link component={RouterLink} to={links.login}>
                Login
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};
