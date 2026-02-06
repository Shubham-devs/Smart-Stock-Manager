import axios from "axios";
// alert(import.meta.env.VITE_API_URL)
console.log(import.meta.env.VITE_API_URL)


const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    timeout: 3000,
});

// Request interceptor
instance.interceptors.request.use(
    async (config) => {
        try {
            const accessToken = localStorage.getItem("userToken")
            // console.log("kjhfjsd", accessToken)
            config.headers.Authorization = `Bearer ${accessToken}`;
            return config;
        } catch (error) {
            console.error("Error setting Authorization header:", error);
            return Promise.reject(error);
        }
    },
    (error) => {
        console.error("Request error:", error);
        return Promise.reject(error);
    }
);

// Response interceptor
instance.interceptors.response.use(
    (response) => {
        console.log("Response data:", response.data);
        return response;
    },
    (error) => {
        console.error("Response error:", error);
        if (error.response.status === 401) {
            // Redirect to login or handle unauthorized error
            console.log("Unauthorized error. Redirecting to login...");
            alert("Please login again!");
            localStorage.removeItem("userToken");
            window.location.href = "/"; // ✅ redirect using browser

        }
        return Promise.reject(error);
    }
);

export default instance;
