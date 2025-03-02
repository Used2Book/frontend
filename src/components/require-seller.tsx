"use client";

import React, { useState, useEffect } from "react";
import { getMe } from "@/services/user"; // Assumes getMe returns the user profile including stripe_account_id
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
        console.log("user?.stripe_account_id:", user?.stripe_account_id)
      } catch (error) {
        toast.error("Failed to load user");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }
  
  // If the user does not have a Stripe account ID, show the Become Seller component
  if (!user?.stripe_account_id?.String) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-lg max-w-md mx-auto">
          <p className="mb-4 text-lg font-medium">
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
