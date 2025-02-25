"use client";

import useAuthStore from "@/contexts/auth-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMe } from "@/services/user";
import Loading from "@/app/loading";

const AuthAdminLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        if (user.role !== "admin") {
          console.log("Unauthorized access, redirecting...");
          router.replace("/user/home");
          return;
        }
        setLoading(false);
        return;
      }

      console.log("No user found, trying to fetch...");
      const fetchedUser = await getMe();

      if (!fetchedUser || fetchedUser.role !== "admin") {
        console.log("Failed to fetch admin, redirecting to login...");
        clearAuth();
        router.replace("/auth");
        return;
      }

      setLoading(false);
    };

    checkAdmin();
  }, [user, clearAuth, router]);

  if (loading) {
    return <Loading />; // ✅ Prevents flickering issues
  }

  return <>{children}</>;
};

export default AuthAdminLayout;
