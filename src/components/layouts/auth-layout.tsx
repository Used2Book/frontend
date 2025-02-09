"use client";

import useAuthStore from "@/contexts/auth-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMe } from "@/services/auth";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);


  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      if (!user) {
        console.log("No user found, trying to fetch...");
        const fetchedUser = await getMe(); // ✅ getMe() already sets Zustand state

        if (!fetchedUser) {
          console.log("Failed to fetch user, redirecting to login...");
          clearAuth();
          setTimeout(() => {
            router.push("/auth");
          }, 1500);
        }
      }
      setLoading(false);
    };

    checkUser();
  }, [user, clearAuth, router]);

  if (loading) {
    return <p>Loading...</p>; // ✅ Prevents flickering issues
  }

  return <>{children}</>;
};

export default AuthLayout;
