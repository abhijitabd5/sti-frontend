import axios from 'axios';

// Create axios instance with base configuration
const httpClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
httpClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibW9iaWxlIjoiOTE3NTExMzAyMiIsImVtYWlsIjpudWxsLCJyb2xlIjoic3VwZXJfYWRtaW4iLCJuYW1lIjoiQWJoaWppdCBBYmQiLCJpYXQiOjE3NTg4ODAyODQsImV4cCI6MTc1OTQ4NTA4NCwiYXVkIjoiZWFydGgtbW92ZXJzLXVzZXJzIiwiaXNzIjoiZWFydGgtbW92ZXJzLWFjYWRlbXkifQ.R1Y8GYGjBqtEhpxTfSl7onQB25GN4Z7ExIjQbJt5Vwc`;//${token};
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default httpClient;
