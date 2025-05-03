// api.ts (new file)
import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true, // Important for cookies/sessions
    headers: {
      'Content-Type': 'application/json',
    }
  });

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect to login if no token exists
      window.location.href = "/";
      return Promise.reject(new Error("No authentication token found"));
    }
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

export default api;