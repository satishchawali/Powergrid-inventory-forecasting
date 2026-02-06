const API_URL = "http://127.0.0.1:8000";

/**
 * Global helper for FETCH requests to handle 401 (Expired/Invalid Token)
 */
const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem("access_token");

    // Merge headers
    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        // 🚨 TOKEN EXPIRED OR UNAUTHORIZED
        // But don't logout/redirect if we're actually trying to login!
        if (endpoint !== "/auth/login") {
            localStorage.removeItem("access_token");

            // Only alert if we're not already on the login page
            if (!window.location.pathname.includes("/login")) {
                alert("Your session has expired. Please log in again.");
                window.location.href = "/login";
            }
        }
    }

    return response;
};

/* ===================== AUTH ===================== */

/**
 * LOGIN
 */
export const loginUser = async (username, password) => {
    const response = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error("Login failed");
    }

    const data = await response.json();
    localStorage.setItem("access_token", data.access_token);
    return data;
};

/**
 * REGISTER
 */
export const registerUser = async (formData) => {
    const response = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(formData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = "Registration failed";

        if (errorData.detail) {
            errorMessage = Array.isArray(errorData.detail)
                ? errorData.detail.map(err => err.msg).join(", ")
                : errorData.detail;
        }

        throw new Error(errorMessage);
    }

    return await response.json();
};

/**
 * LOGOUT
 */
export const logoutUser = () => {
    localStorage.removeItem("access_token");
};

/* ===================== PROFILE ===================== */

/**
 * GET USER PROFILE
 */
export const getUserProfile = async () => {
    const response = await apiFetch("/settings/profile");

    if (!response.ok) {
        throw new Error(`Failed to load profile (${response.status})`);
    }

    return await response.json();
};

/**
 * UPDATE USER PROFILE
 */
export const updateUserProfile = async (data) => {
    const response = await apiFetch("/settings/profile", {
        method: "PUT",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Profile update failed");
    }

    return await response.json();
};

/* ===================== PASSWORD ===================== */

/**
 * CHANGE PASSWORD
 */
export const changePassword = async (data) => {
    const response = await apiFetch("/settings/change-password", {
        method: "PUT",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Password change failed");
    }

    return await response.json();
};

/* ===================== APP DATA ===================== */

export const getForecast = async (period = 7) => {
    const response = await apiFetch(`/forecast?period=${period}`);

    if (!response.ok) {
        throw new Error(`Forecast error (${response.status})`);
    }

    return await response.json();
};

export const getInventory = async () => {
    const response = await apiFetch("/inventory/");

    if (!response.ok) {
        throw new Error(`Inventory error (${response.status})`);
    }

    return await response.json();
};

export const getDashboard = async () => {
    const response = await apiFetch("/dashboard/");

    if (!response.ok) {
        throw new Error(`Dashboard error (${response.status})`);
    }

    return await response.json();
};

/* ===================== REPORTS ===================== */

export const getReports = async () => {
    const response = await apiFetch("/reports/");
    if (!response.ok) throw new Error("Failed to fetch reports");
    return await response.json();
};

export const getReportTypes = async () => {
    const response = await apiFetch("/reports/types");
    if (!response.ok) throw new Error("Failed to fetch report types");
    return await response.json();
};

export const generateReport = async (typeId, title) => {
    const response = await apiFetch(`/reports/generate?type_id=${typeId}${title ? `&title=${encodeURIComponent(title)}` : ""}`, {
        method: "POST",
    });
    if (!response.ok) throw new Error("Failed to generate report");
    return await response.json();
};

export const getReportStatus = async (reportId) => {
    const response = await apiFetch(`/reports/${reportId}/status`);
    if (!response.ok) throw new Error("Failed to check report status");
    return await response.json();
};
