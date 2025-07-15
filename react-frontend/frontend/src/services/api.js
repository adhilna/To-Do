import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});



// Function to refresh access token using the refresh token
const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
        console.error("No refresh token found!");
        return;
    }

    try {
        const res = await api.post("../accounts/token/refresh/", {
            refresh: refreshToken
        });

        // Store the new access token
        localStorage.setItem("access_token", res.data.access);
    } catch (err) {
        console.error("Token refresh failed:", err);
    }
};

// Intercept request to add the Authorization header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token"); // Get the access token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercept response to handle expired token (401 error)
api.interceptors.response.use(
    (response) => response, // Return response if successful
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401 (Unauthorized) and token expired
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark the request as retried
            await refreshAccessToken(); // Refresh the token
            const newAccessToken = localStorage.getItem("access_token");
            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`; // Retry with new token
            return axios(originalRequest); // Retry the original request
        }

        return Promise.reject(error); // Reject if not a 401 error
    }
);

export default api;