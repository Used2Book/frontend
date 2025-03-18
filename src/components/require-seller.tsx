"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getMe } from "@/services/user";

const RequireSeller: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const updatedUser = await getMe();
        setUser(updatedUser);
      } catch (error) {
        toast.error("Failed to load user");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  // Redirect in an effect, not in render
  useEffect(() => {
    // Only run if loading is done and user is fetched
    if (!loading && user && !user.omise_account_id?.String) {
      router.push("/user/setting/bank-account");
    }
  }, [loading, user, router]);

  // Show a loading state while fetching user
  if (loading) {
    return <p>Loading...</p>;
  }

  // If the user has no Omise account, we might render a "Redirecting..." message
  // but the actual push will happen in the useEffect above.
  if (!user?.omise_account_id?.String) {
    // We can just render null or some fallback UI, because the useEffect is handling the redirect
    return <p>Redirecting...</p>;
  }

  // If user has the Omise account, render children
  return <>{children}</>;
};

export default RequireSeller;
