const API_URL = "http://127.0.0.1:8000";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const loginUser = async (username, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) throw new Error("Login failed");
    return await response.json();
};

export const registerUser = async (formData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    });

    if (!response.ok) throw new Error("Registration failed");
    return await response.json();
};

export const getForecast = async (day) => {
    const response = await fetch(`${API_URL}/forecast?day=${day}`, {
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        }
    });

    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
};
