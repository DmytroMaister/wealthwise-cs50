import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const get = (url: string, params?: any) => {
  return api.get(url, { params }).then((res) => res.data);
};

export const post = (url: string, body?: any) => {
  return api.post(url, body).then((res) => res.data);
};

export const put = (url: string, body?: any) => {
  return api.put(url, body).then((res) => res.data);
};

export const del = (url: string, params?: any) => {
  return api.delete(url, { params }).then((res) => res.data);
};
