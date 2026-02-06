const API_URL = "http://127.0.0.1:8000";

/**
 * Attach JWT token to every protected request
 */
const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

/* ===================== AUTH ===================== */

/**
 * LOGIN
 */
export const loginUser = async (username, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error("Login failed");
    }

    const data = await response.json();

    // 🔐 STORE TOKEN
    localStorage.setItem("access_token", data.access_token);

    return data;
};

/**
 * REGISTER
 */
export const registerUser = async (formData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    const response = await fetch(`${API_URL}/settings/profile`, {
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to load profile (${response.status})`);
    }

    return await response.json();
};

/**
 * UPDATE USER PROFILE
 */
export const updateUserProfile = async (data) => {
    const response = await fetch(`${API_URL}/settings/profile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
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
    const response = await fetch(`${API_URL}/settings/change-password`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Password change failed");
    }

    return await response.json();
};

/* ===================== APP DATA ===================== */

export const getForecast = async (day) => {
    const response = await fetch(`${API_URL}/forecast?day=${day}`, {
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
    });

    if (!response.ok) {
        throw new Error(`Forecast error (${response.status})`);
    }

    return await response.json();
};

export const getInventory = async () => {
    const response = await fetch(`${API_URL}/inventory/`, {
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
    });

    if (!response.ok) {
        throw new Error(`Inventory error (${response.status})`);
    }

    return await response.json();
};

export const getDashboard = async () => {
    const response = await fetch(`${API_URL}/dashboard/`, {
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
    });

    if (!response.ok) {
        throw new Error(`Dashboard error (${response.status})`);
    }

    return await response.json();
};
