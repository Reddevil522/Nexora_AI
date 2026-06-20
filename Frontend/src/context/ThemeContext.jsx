import { createContext, useContext, useState, useEffect, useCallback } from "react";

const ThemeContext = createContext();

const STORAGE_KEY = "nexora-theme";

function getInitialTheme() {
    // 1. Check saved preference first
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
    // 2. Fall back to OS preference
    if (typeof window !== "undefined" && window.matchMedia) {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "dark";
}

function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === "light") {
        root.setAttribute("data-theme", "light");
    } else {
        root.removeAttribute("data-theme");
    }
}

export function ThemeProvider({ children }) {
    const [theme, setThemeState] = useState(() => {
        const initial = getInitialTheme();
        applyTheme(initial);
        return initial;
    });

    const setTheme = useCallback((newTheme) => {
        setThemeState(newTheme);
        applyTheme(newTheme);
        localStorage.setItem(STORAGE_KEY, newTheme);
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(theme === "dark" ? "light" : "dark");
    }, [theme, setTheme]);

    // Listen for OS theme changes (only if user hasn't manually set a preference)
    useEffect(() => {
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (e) => {
            if (!localStorage.getItem(STORAGE_KEY)) {
                setTheme(e.matches ? "dark" : "light");
            }
        };
        mq.addEventListener("change", handleChange);
        return () => mq.removeEventListener("change", handleChange);
    }, [setTheme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
    return ctx;
}
