import { useState, type FC } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { changePassword } from '../../api/profileApi';
import './PasswordForm.css';

export const PasswordForm: FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setError('');

    // Simple validation
    if (!currentPassword) return setError('Current password required');
    if (!newPassword) return setError('New password required');
    if (newPassword.length < 8)
      return setError('Password must be at least 8 characters');
    if (newPassword !== confirmation) return setError('Passwords do not match');

    try {
      setSaving(true);

      // Change password
      await changePassword(currentPassword, newPassword, confirmation);

      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box className="password-form">
      {/* Error */}
      {error && (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      )}

      {/* Fields */}
      <TextField
        fullWidth
        label="Current password"
        type="password"
        margin="normal"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />

      <TextField
        fullWidth
        label="New password"
        type="password"
        margin="normal"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <TextField
        fullWidth
        label="Confirm new password"
        type="password"
        margin="normal"
        value={confirmation}
        onChange={(e) => setConfirmation(e.target.value)}
      />

      {/* Actions */}
      <Box className="password-form-actions">
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Update'}
        </Button>
      </Box>
    </Box>
  );
};
