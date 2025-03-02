// services/authService.ts
import {httpClient} from "@/lib/http-client";
import useAuthStore from "@/contexts/auth-store";
import { toast } from "react-hot-toast";
import { getMe } from "@/services/user";



export const signup = async (first_name: string, last_name: string, email: string, password: string) => {
  try {
    const res = await httpClient.post("auth/signup/email", {first_name, last_name, email, password });
    return res.data;
  } catch (err) {
    console.error("Signup failed:", err);
    throw err;
  }
};

// ✅ Login with Email & Password
export const login = async (email: string, password: string) => {
  try {
    const res = await httpClient.post("auth/login/email", {
      email: email,
      password: password
    });
    console.log(`res.data.token : ${res.data.token}`)
    useAuthStore.getState().setToken(res.data.token);
    await getMe();
    return res.data;
  } catch (err) {
    console.error("Login failed:", err);
    throw err;
  }
};

export const loginWithGoogle = () => {
  const redirectTo = encodeURIComponent(window.location.href); // ✅ Get current page
  window.location.href = `http://localhost:6951/auth/google-provider?redirect=${redirectTo}`;
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
    const res = await httpClient.post("/auth-token/refresh-token");
    const newToken = res.data.token;
    useAuthStore.getState().setToken(newToken);
    return newToken;
  } catch (err) {
    console.error("Refresh token failed:", err);
    useAuthStore.getState().clearAuth(); // Logout if refresh fails
    return null;
  }
};

// ✅ Send OTP Request
export async function sendOTP(phone_number: string) {
  try {
    console.log("phone:",phone_number)
    const res = await httpClient.post("auth/send-otp", { phone_number: phone_number })
    console.log("phone log res:", res)
    console.log("Response Status:", res.status); // Debugging
    console.log("Response Data:", res); // Debugging

    const data = await res.data;


    // Check if the request was successful
    if (res.status == 409) {
      return { success: false, message: "Phone number is already in used, please put new phone number .."};
    }
      

    if (res.status !== 200) throw new Error(data.message || "Failed to send OTP");

    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

// ✅ Verify OTP Request
export async function verifyOTP(phone: string, otp: string) {
  try {
    const res: any = await httpClient.post("auth/verify-otp", { phone_number: phone, otp: otp})

    const data = await res.data;

    console.log("Response Status:", res.status); // Debugging
    console.log("Response Data:", data); // Debugging

    // Check if the request was successful
    if (res.status !== 200) throw new Error(data.message || "OTP verification failed");

    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

// ✅ Send OTP Request
export async function resendOTP(phone: string) {
  try {
    const res: any = await httpClient.post("auth/resend-otp", { phone_number: phone })

    const data = await res.data;

    console.log("Response Status:", res.status); // Debugging
    console.log("Response Data:", data); // Debugging

    // Check if the request was successful
    if (res.status !== 200) throw new Error(data.message || "Failed to send OTP");

    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

