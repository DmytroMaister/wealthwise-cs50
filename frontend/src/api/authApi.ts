import { get, post } from './api';

export const login = (username: string, password: string) => {
  const form = new FormData();
  form.append('username', username);
  form.append('password', password);

  return post('/login', form);
};

export const register = (
  username: string,
  password: string,
  confirm: string
) => {
  const form = new FormData();
  form.append('username', username);
  form.append('password', password);
  form.append('confirmation', confirm);

  return post('/register', form);
};

export const fetchUser = () => {
  return get('/me');
};
