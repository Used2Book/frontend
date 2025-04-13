"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/contexts/auth-store";
import { getMe } from "@/services/user";
import Loading from "@/app/loading";
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

            useAuthStore.getState().setToken(token); 

            // ✅ Fetch user details
            const user = await getMe();

            if (!user) {
                router.replace("/auth"); // ❌ If user fetching fails → Go to login
                return;
            }

            console.log("user.role:", user.role)

            if (user.role === "admin") {
                router.push("/admin");
            } else {
                router.push("/user/home"); 
            }
        };

        handleAuthCallback();
    }, [router]);

    return <Loading/>;
}
