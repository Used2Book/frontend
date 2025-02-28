// services/api.ts
import axios from "axios";
export const API_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;



export const httpClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for sending cookies
  headers: {
    "Content-Type": "application/json",
  },
});


function getToken() {
  try {
    const token = JSON.parse(localStorage.getItem("auth") || "{}").state?.token;
    return token || null;
  } catch (e) {
    console.error("Failed to parse auth object from local storage:", e);
    return null;
  }
}

httpClient.interceptors.request.use(
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





// // ✅ Handle token expiration & auto-refresh
// httpClient.interceptors.response.use(
//   (response) => response, // If response is OK, return it

//   async (error) => {
//     const originalRequest = error.config;
//     const status = error.response?.status;

//     if (status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true; // Prevent infinite loop

//       try {
//         console.log("Refreshing token...");
//         const newToken = await refreshToken(); // Try refreshing
//         if (newToken) {
//           useAuthStore.getState().setToken(newToken);
//           originalRequest.headers.Authorization = `Bearer ${newToken}`;
//           return httpClient(originalRequest); // Retry original request
//         }
//       } catch (refreshError) {
//         console.error("Token refresh failed, logging out...");
//         useAuthStore.getState().clearAuth(); // Logout user
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default {httpClient};


