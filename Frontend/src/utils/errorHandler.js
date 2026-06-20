/**
 * Centralized error handler — maps all API/network errors to user-friendly messages.
 */

export const handleError = (error) => {
    if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 400) return data?.error || data?.message || "Invalid request. Please check your input.";
        if (status === 401) return data?.error || "Session expired. Please log in again.";
        if (status === 403) return "Access denied. You don't have permission.";
        if (status === 404) return data?.error || "Resource not found.";
        if (status === 409) return data?.error || "Resource already exists.";
        if (status === 422) return data?.error || "Validation failed. Please check your input.";
        if (status === 429) return "Too many requests. Please slow down and try again later.";
        if (status === 500) return "Internal server error. Please try again later.";
        if (status === 502) return "Bad gateway. The server is temporarily unavailable.";
        if (status === 503) return "Service unavailable. Please try again later.";
        if (status === 504) return "Gateway timeout. Please try again.";

        return data?.error || data?.message || "An unexpected server error occurred.";
    }

    if (error.request) {
        return "Unable to connect to the server. Check your internet connection.";
    }

    if (error.code === "ECONNABORTED") {
        return "Request timed out. Please try again.";
    }

    return "An unexpected error occurred.";
};
