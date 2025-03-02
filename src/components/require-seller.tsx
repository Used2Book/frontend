"use client";

import React, { useState, useEffect } from "react";
import { getMe } from "@/services/user"; // Assumes getMe returns the user profile including omise_account_id
import BecomeSellerComponent from "@/components/become-seller";
import toast from "react-hot-toast";

// This component will wrap pages that require the user to be a seller.
const RequireSeller: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  console.log("User Omise Account ID:", user?.omise_account_id?.String); // ✅ Correct log

  if (loading) {
    return <p>Loading...</p>;
  }
  
  // If the user does not have an Omise account ID, show the Become Seller component
  if (!user?.omise_account_id?.String) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
  <div className="bg-white p-6 rounded-lg shadow-lg mx-auto w-full max-w-md">
    <p className="mb-4 text-lg font-medium text-center">
      You need to become a seller before you can create a listing.
    </p>
    <BecomeSellerComponent />
  </div>
</div>

    );
  }

  return <>{children}</>;
};

export default RequireSeller;
