import "./ThemeToggle.css";
import { useTheme } from "../context/ThemeContext.jsx";

/* ── Sun icon ── */
function SunIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4.5" />
            <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
    );
}

/* ── Moon icon ── */
function MoonIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"
            stroke="none" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
    );
}

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <button
            className={`theme-toggle theme-toggle--${isDark ? 'dark' : 'light'}`}
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
        >
            <span className="theme-toggle__icon">
                {isDark ? <SunIcon /> : <MoonIcon />}
            </span>
        </button>
    );
}
