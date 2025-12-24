import { useState, type FC } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { updateUsername } from '../../api/profileApi';
import './ProfileForm.css';

export const ProfileForm: FC<{
  onClose: () => void;
  onSuccess: () => void;
}> = ({ onClose, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setError('');

    // Validation
    if (!username) {
      setError('username required');
      return;
    }

    try {
      setSaving(true);

      // Update username
      await updateUsername(username);

      // Notify parent to refresh user
      onSuccess();

      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'failed to update username');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-form">
      {/* Error message */}
      {error && <Typography className="profile-error">{error}</Typography>}

      {/* Username field */}
      <TextField
        fullWidth
        label="New username"
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      {/* Actions */}
      <div className="profile-form-actions">
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
};
