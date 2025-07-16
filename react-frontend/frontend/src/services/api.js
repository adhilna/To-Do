import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Utility to get tokens
const getAccessToken = () => localStorage.getItem("access_token");
const getRefreshToken = () => localStorage.getItem("refresh_token");

// Utility to save new access token
const storeAccessToken = (token) => {
    localStorage.setItem("access_token", token);
};

// Refresh access token using refresh token
const refreshAccessToken = async () => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
        console.warn("No refresh token found. Logging out...");
        return null;
    }

    try {
        const response = await api.post("accounts/token/refresh/", {
            refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        storeAccessToken(newAccessToken);
        return newAccessToken;

    } catch (err) {
        console.error("Token refresh failed:", err?.response?.data || err.message);
        return null;
    }
};

// Attach token to every request
api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle 401 errors (token expiration) and retry the original request
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Avoid retry loops
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const newAccessToken = await refreshAccessToken();

            if (!newAccessToken) {
                localStorage.clear();
                window.location.href = "/";
                return Promise.reject(error);
            }

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
        }

        // Handle network or other errors
        if (!error.response) {
            console.error("Network error:", error.message);
        }

        return Promise.reject(error);
    }
);

export default api;
