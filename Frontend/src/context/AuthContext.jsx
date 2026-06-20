import { createContext, useState, useEffect, useContext } from "react";
import { authService } from "../services/authService";
import { toastSuccess, toastError } from "../utils/toast.js";
import { handleError } from "../utils/errorHandler.js";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const userData = await authService.getCurrentUser();
                    setUser(userData);
                } catch (error) {
                    console.error("Failed to load user session", error);
                    setToken(null);
                    setUser(null);
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                }
            }
            setLoading(false);
        };
        loadUser();
    }, [token]);

    const login = async (credentials) => {
        try {
            const data = await authService.login(credentials);
            setToken(data.token);
            setUser(data.user);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            toastSuccess(`Welcome back, ${data.user?.name || "there"}! 👋`);
        } catch (err) {
            const message = err.userMessage || handleError(err) || "Invalid email or password.";
            toastError(message);
            throw new Error(message);
        }
    };

    const register = async (userData) => {
        try {
            const data = await authService.register(userData);
            setToken(data.token);
            setUser(data.user);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            toastSuccess("Account created successfully. Welcome to Nexora AI! 🎉");
        } catch (err) {
            const message = err.userMessage || handleError(err) || "Registration failed. Please try again.";
            toastError(message);
            throw new Error(message);
        }
    };

    const logout = () => {
        authService.logout();
        setToken(null);
        setUser(null);
        toastSuccess("Logged out successfully. See you soon!");
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
