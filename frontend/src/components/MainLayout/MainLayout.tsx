import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import type { FC } from 'react';
import type { MainLayoutProps, MenuButton } from './MainLayout.types';
import { logout } from '../../api/authApi';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { links } from '../../utils/links';
import { menuButtons } from './MainLayout.utils';
import './MainLayout.css';

export const MainLayout: FC<MainLayoutProps> = ({
  user,
  onLogout,
  children,
}) => {
  // Router helpers
  const navigate = useNavigate();
  const location = useLocation();

  // Handle logout click
  const handleLogout = async () => {
    try {
      // Call logout API
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      // Clear user state and redirect to login
      onLogout();
      navigate(links.login, { replace: true });
    }
  };

  // Check if menu link is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <Box className="main-layout">
      {/* Top navigation bar */}
      <AppBar position="static" className="main-appbar">
        <Toolbar className="main-toolbar">
          {/* App logo / title */}
          <Typography variant="h6" className="main-logo">
            WealthWise
          </Typography>

          {/* Show menu only when user is logged in */}
          {user && (
            <div className="menu-wrapper">
              {/* Left navigation menu */}
              <div className="nav-menu">
                {menuButtons.map((button: MenuButton) => (
                  <Link
                    key={button.label}
                    to={button.path}
                    className={`button-link ${
                      isActive(button.path) ? 'active' : ''
                    }`}
                  >
                    {button.label}
                  </Link>
                ))}
              </div>

              {/* Right side actions */}
              <div className="nav-menu nav-menu-right">
                <Button className="nav-logout" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          )}
        </Toolbar>
      </AppBar>

      {/* Page content */}
      <Box className="main-content">{children}</Box>
    </Box>
  );
};
