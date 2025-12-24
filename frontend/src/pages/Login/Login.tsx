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
import type { User } from '../../types/commonTypes';
import './Login.css';

export const Login: FC<{ onLoggedIn: (user: User) => void }> = ({
  onLoggedIn,
}) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle login submit
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call login API
      const user = await login(username, password);

      // Save user in app state
      onLoggedIn(user);

      // Redirect to home page
      navigate(links.home, { replace: true });
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.error ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Login card */}
      <Card className="login-card">
        <CardContent>
          {/* Page title */}
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>

          {/* Error message */}
          {error && <p className="error">{error}</p>}

          {/* Login form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {/* Username input */}
            <TextField
              fullWidth
              label="Username"
              autoComplete="off"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            {/* Password input */}
            <TextField
              fullWidth
              autoComplete="off"
              label="Password"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Submit button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              Login
            </Button>

            {/* Register link */}
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
