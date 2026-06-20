/**
 * Centralized Toast Notification Service — Nexora AI
 * Single source of truth for all user-facing notifications.
 */
import toast from "react-hot-toast";

const DURATION = {
    success: 3000,
    error: 4500,
    warning: 4000,
    info: 3500,
};

const BASE_STYLE = {
    fontFamily: "'Inter', 'Outfit', sans-serif",
    fontSize: "13.5px",
    fontWeight: 500,
    borderRadius: "10px",
    padding: "12px 16px",
    maxWidth: "360px",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
};

const STYLES = {
    success: {
        ...BASE_STYLE,
        background: "rgba(16, 185, 129, 0.12)",
        border: "1px solid rgba(16, 185, 129, 0.3)",
        color: "#6ee7b7",
        boxShadow: "0 4px 20px rgba(16, 185, 129, 0.1)",
    },
    error: {
        ...BASE_STYLE,
        background: "rgba(248, 113, 113, 0.12)",
        border: "1px solid rgba(248, 113, 113, 0.3)",
        color: "#fca5a5",
        boxShadow: "0 4px 20px rgba(248, 113, 113, 0.1)",
    },
    warning: {
        ...BASE_STYLE,
        background: "rgba(251, 191, 36, 0.12)",
        border: "1px solid rgba(251, 191, 36, 0.3)",
        color: "#fde68a",
        boxShadow: "0 4px 20px rgba(251, 191, 36, 0.08)",
    },
    info: {
        ...BASE_STYLE,
        background: "rgba(99, 179, 237, 0.12)",
        border: "1px solid rgba(99, 179, 237, 0.3)",
        color: "#bee3f8",
        boxShadow: "0 4px 20px rgba(99, 179, 237, 0.08)",
    },
    loading: {
        ...BASE_STYLE,
        background: "rgba(255, 157, 77, 0.1)",
        border: "1px solid rgba(255, 157, 77, 0.25)",
        color: "#fdba74",
        boxShadow: "0 4px 20px rgba(255, 157, 77, 0.08)",
    },
};

export const toastSuccess = (message) =>
    toast.success(message, {
        duration: DURATION.success,
        style: STYLES.success,
        iconTheme: { primary: "#34d399", secondary: "#0f1a13" },
    });

export const toastError = (message) =>
    toast.error(message, {
        duration: DURATION.error,
        style: STYLES.error,
        iconTheme: { primary: "#f87171", secondary: "#1a0a0a" },
    });

export const toastWarning = (message) =>
    toast(message, {
        duration: DURATION.warning,
        icon: "⚠️",
        style: STYLES.warning,
    });

export const toastInfo = (message) =>
    toast(message, {
        duration: DURATION.info,
        icon: "ℹ️",
        style: STYLES.info,
    });

export const toastLoading = (message) =>
    toast.loading(message, {
        style: STYLES.loading,
    });

export const dismissToast = (toastId) => toast.dismiss(toastId);

export const toastPromise = (promise, { loading, success, error }) =>
    toast.promise(promise, { loading, success, error }, {
        style: STYLES.loading,
        success: { style: STYLES.success, iconTheme: { primary: "#34d399", secondary: "#0f1a13" } },
        error: { style: STYLES.error, iconTheme: { primary: "#f87171", secondary: "#1a0a0a" } },
    });
