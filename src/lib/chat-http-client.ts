import axios from "axios";


function getToken() {
    try {
        const token = JSON.parse(localStorage.getItem("auth") || "{}").state?.token;
        return token || null;
    } catch (e) {
        console.error("Failed to parse auth object from local storage:", e);
        return null;
    }
}

const chatHttpClient = axios.create({
  baseURL: "http://localhost:5002/",
  withCredentials: true, // Important for sending cookies
  headers: {
    "Content-Type": "application/json",
  },
});

chatHttpClient.interceptors.request.use(
    (config) => {
      const token = getToken();
      // If token is available, set Authorization header
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

export default chatHttpClient;
