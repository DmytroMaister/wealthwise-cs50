import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import type { FC } from 'react';
import type { MainLayoutProps, MenuButton } from './MainLayout.types';
import { logout } from '../../api/authApi';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { links } from '../../utils/links';
import { menuButtons } from './MainLayout.unils';

import './MainLayout.css';

export const MainLayout: FC<MainLayoutProps> = ({
  user,
  onLogout,
  children,
}) => {
  const navigate = useNavigate();
  const location = useLocation(); // 👈 ВАЖНО

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      onLogout();
      navigate(links.login, { replace: true });
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ mr: 3 }}>
            WealthWise
          </Typography>

          {user && (
            <div className="menu-wrapper">
              <div className="nav-menu">
                {menuButtons.map((button: MenuButton) => (
                  <Link
                    key={button.label}
                    className={`${
                      isActive(button.path) ? 'active' : ''
                    } button-link`}
                    to={button.path}
                  >
                    {button.label}
                  </Link>
                ))}
              </div>
              <div className="nav-menu">
                <Typography variant="body2" sx={{ mr: 2 }}>
                  {user.username}
                </Typography>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }}>{children}</Box>
    </Box>
  );
};
