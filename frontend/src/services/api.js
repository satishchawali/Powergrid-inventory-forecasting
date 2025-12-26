const API_URL = "http://127.0.0.1:8000";

export const getForecast = async (day) => {
    try {
        const response = await fetch(`${API_URL}/forecast?day=${day}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};
