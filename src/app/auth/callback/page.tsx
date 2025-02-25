"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/contexts/auth-store";
import { getMe } from "@/services/user";

export default function AuthCallback() {
    const router = useRouter();

    useEffect(() => {
        const handleAuthCallback = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get("token");

            if (!token) {
                router.replace("/auth"); // ❌ No token → Redirect to login
                return;
            }

            useAuthStore.getState().setToken(token); // ✅ Store token in Zustand

            // ✅ Fetch user details
            const user = await getMe();

            if (!user) {
                router.replace("/auth"); // ❌ If user fetching fails → Go to login
                return;
            }

            console.log("user.role:", user.role)

            // ✅ Check role and redirect accordingly
            if (user.role === "admin") {
                router.push("/admin"); // ✅ Admins go to `/admin`
            } else {
                router.push("/user/home"); // ✅ Normal users go to `/user/home`
            }
        };

        handleAuthCallback();
    }, [router]);

    return <p>Logging you in...</p>;
}
