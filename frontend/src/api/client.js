import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:8081',
});

// Optionally add a request interceptor to inject the token if needed
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
