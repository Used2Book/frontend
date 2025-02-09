"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/contexts/auth-store";
import { getMe } from "@/services/auth";
import useStore from "@/contexts/useStore";
export default function AuthCallback() {
    const router = useRouter();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (token) {
            useAuthStore.getState().setToken(token); // ✅ Store token in Zustand
            getMe(); // ✅ Fetch user details
            router.push("/user/home"); // ✅ Redirect to user dashboard
        } else {
            router.push("/auth"); // ❌ If no token, go back to login page
        }
    }, [router, useAuthStore]);

    return <p>Logging you in...</p>;
}
