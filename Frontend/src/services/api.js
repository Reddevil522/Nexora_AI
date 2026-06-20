import axios from 'axios';
import { toastError } from '../utils/toast.js';
import { handleError } from '../utils/errorHandler.js';

// Configure Axios Instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 15000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for automatic unauthorized handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const pathname = window.location.pathname;
        const publicPaths = ["/login", "/signup", "/home"];

        // JWT expired / invalid — auto logout + redirect
        if (status === 401 && !publicPaths.includes(pathname)) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            toastError("Your session has expired. Please log in again.");
            setTimeout(() => {
                window.location.href = "/home";
            }, 1500);
        }

        // Attach user-friendly message to the error for callers
        error.userMessage = handleError(error);
        return Promise.reject(error);
    }
);

export default api;
