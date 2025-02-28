import axios from "axios";
export const API_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;

function getToken() {
    try {
      const token = JSON.parse(localStorage.getItem("auth") || "{}").state?.token;
      return token || null;
    } catch (e) {
      console.error("Failed to parse auth object from local storage:", e);
      return null;
    }
  }


const uploadClient = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
});

uploadClient.interceptors.request.use(
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

export default uploadClient;