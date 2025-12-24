import { get, put } from './api';

export const fetchUser = () => get('/api/me');

export const updateUsername = (username: string) =>
  put('/api/profile/username', { username });

export const changePassword = (
  current_password: string,
  new_password: string,
  confirmation: string
) => {
  return put('/api/profile/password', {
    current_password,
    new_password,
    confirmation,
  });
};

export const fetchLoginHistory = () => get('/api/profile/logins');
