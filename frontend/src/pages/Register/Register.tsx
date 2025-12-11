import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Link,
} from '@mui/material';
import { links } from '../../utils/links';

import '../Login/Login.css';

export const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    console.log('Register attempt:', { username, password });
  };

  return (
    <div className="login-page">
      <Card className="login-card">
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Register
          </Typography>

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

            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
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
