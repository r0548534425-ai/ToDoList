import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://todolistserver-g9dd.onrender.com";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// הוספת token ל-request אם קיים
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// חיבור interceptor לשגיאת 401
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
