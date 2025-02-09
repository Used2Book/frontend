// services/authService.ts
import httpClient from "@/lib/http-client";
import useAuthStore from "@/contexts/auth-store";
import { toast } from "react-hot-toast";


// ✅ Get user info (without modifying token)
export const getMe = async () => {
  try {
    console.log("Fetching user...");
    const { data } = await httpClient.get("user/me");
    
    if (data?.user) {
      useAuthStore.getState().setUser(data.user); // ✅ Only update Zustand once
      console.log("User fetched:", data.user);
      return data.user; // ✅ Return user for further use
    }

    return null;
  } catch (err) {
    console.warn("Failed to fetch user:", err);
    toast.error("Your session has expired. Please log in again.");
    useAuthStore.getState().clearAuth(); // ✅ Clear Zustand if API fails
    return null;
  }
};



export const signup = async (email: string, password: string) => {
  try {
    const res = await httpClient.post("user/signup/email", { email, password });
    return res.data;
  } catch (err) {
    console.error("Signup failed:", err);
    throw err;
  }
};

// ✅ Login with Email & Password
export const login = async (email: string, password: string) => {
  try {
    const res = await httpClient.post("user/login/email", { 
      email: email, 
      password: password });
    console.log(`res.data.token : ${res.data.token}`)
    useAuthStore.getState().setToken(res.data.token);
    getMe();
    return res.data;
  } catch (err) {
    console.error("Login failed:", err);
    throw err;
  }
};

export const loginWithGoogle = () => {
  const redirectTo = encodeURIComponent(window.location.href); // ✅ Get current page
  window.location.href = `http://localhost:6951/user/google-provider?redirect=${redirectTo}`;
};


// ✅ Logout
export const logout = async () => {
  try {
    // await httpClient.post("user/logout");
    useAuthStore.getState().clearAuth();
  } catch (error) {
    console.error("Failed to log out", error);
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const res = await httpClient.post("/auth/refresh-token");
    const newToken = res.data.token;
    useAuthStore.getState().setToken(newToken);
    return newToken;
  } catch (err) {
    console.error("Refresh token failed:", err);
    useAuthStore.getState().clearAuth(); // Logout if refresh fails
    return null;
  }
};
