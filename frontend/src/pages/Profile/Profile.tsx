import { useEffect, useState } from 'react';
import { Box, Button, Divider, Typography } from '@mui/material';
import { WiseDialog } from '../../components/WiseDialog/WiseDialog';
import { ProfileForm } from '../../components/ProfileForm/ProfileForm';
import { PasswordForm } from '../../components/PasswordForm/PasswordForm';
import { fetchLoginHistory, fetchUser } from '../../api/profileApi';
import type { LoginRow, ProfileAction } from './Profile.types';
import type { User } from '../../types/commonTypes';
import './Profile.css';

export const Profile = () => {
  const [open, setOpen] = useState<ProfileAction>(null);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userError, setUserError] = useState('');

  const [logins, setLogins] = useState<LoginRow[]>([]);
  const [loadingLogins, setLoadingLogins] = useState(true);
  const [loginsError, setLoginsError] = useState('');

  const handleClose = () => setOpen(null);

  // Load current user from API
  const loadUser = async () => {
    try {
      setLoading(true);
      setUserError('');

      const res = await fetchUser();
      setUser(res?.user ?? null);
    } catch (err: any) {
      setUserError(err?.response?.data?.error ?? 'Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  // Load login history from API
  const loadLogins = async () => {
    try {
      setLoadingLogins(true);
      setLoginsError('');

      const data = await fetchLoginHistory();
      setLogins(data);
    } catch (err: any) {
      setLoginsError(
        err?.response?.data?.error ?? 'Failed to load login history'
      );
    } finally {
      setLoadingLogins(false);
    }
  };

  // Load user info + logins on mount
  useEffect(() => {
    loadUser();
    loadLogins();
  }, []);

  return (
    <Box className="profile-page">
      {loading ? (
        <Typography className="profile-muted">Loading...</Typography>
      ) : userError ? (
        <Typography className="profile-error">{userError}</Typography>
      ) : !user ? (
        <Typography className="profile-muted">Not logged in</Typography>
      ) : (
        <>
          {/* Page title */}
          <Typography variant="h5" className="profile-title">
            Profile
          </Typography>

          {/* Username section */}
          <Box className="profile-row">
            <Typography className="profile-value">
              Username: <b>{user.username}</b>
            </Typography>

            {/* Actions */}
            <Box className="profile-buttons">
              <Button
                size="small"
                variant="outlined"
                onClick={() => setOpen('username')}
              >
                Change username
              </Button>

              <Button
                size="small"
                variant="outlined"
                onClick={() => setOpen('password')}
              >
                Change password
              </Button>
            </Box>
          </Box>

          <Divider className="profile-divider" />

          {/* Login history title */}
          <Typography className="profile-subtitle" fontSize={24}>
            Recent logins
          </Typography>

          {/* Login history states */}
          {loadingLogins ? (
            <Typography className="profile-muted">Loading...</Typography>
          ) : loginsError ? (
            <Typography className="profile-error">{loginsError}</Typography>
          ) : logins.length === 0 ? (
            <Typography className="profile-muted">No logins yet</Typography>
          ) : (
            <Box className="profile-logins">
              {logins.map((l) => (
                <Box key={l.id} className="profile-login-row">
                  <Typography className="profile-login-date">
                    {l.logged_in_at}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* Change username dialog */}
          <WiseDialog
            open={open === 'username'}
            onClose={handleClose}
            title="Change username"
            fullWidth
          >
            <ProfileForm
              onClose={handleClose}
              onSuccess={async () => {
                await loadUser();
              }}
            />
          </WiseDialog>

          {/* Change password dialog */}
          <WiseDialog
            open={open === 'password'}
            onClose={handleClose}
            title="Change password"
            fullWidth
          >
            <PasswordForm onClose={handleClose} />
          </WiseDialog>
        </>
      )}
    </Box>
  );
};
