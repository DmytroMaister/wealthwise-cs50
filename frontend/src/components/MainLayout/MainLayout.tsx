import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import type { FC } from 'react';
import type { MainLayoutProps } from './MainLayout.types';
import { logout } from '../../api/authApi';
import { useNavigate } from 'react-router-dom';
import { links } from '../../utils/links';

export const MainLayout: FC<MainLayoutProps> = ({
  user,
  onLogout,
  children,
}) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      onLogout(); // 👈 ВАЖНО
      navigate(links.login, { replace: true });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            WealthWise
          </Typography>

          {user && (
            <Typography variant="body2" sx={{ mr: 2 }}>
              {user.username}
            </Typography>
          )}

          {user && (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }}>{children}</Box>
    </Box>
  );
};
