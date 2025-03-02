"use client";

import React from "react";
import toast from "react-hot-toast";
// Replace with your configured HTTP client or use fetch directly
import { becomeSeller } from "@/services/user";


const BecomeSellerComponent: React.FC = () => {
  const handleBecomeSeller = async () => {
    await becomeSeller();
  };

  return (
    <div className="p-4 border rounded shadow-sm">
      <h2 className="text-xl font-bold mb-2">Become a Seller</h2>
      <p className="mb-4">
        To start selling, click the button below to connect your account with Stripe.
      </p>
      <button
        onClick={handleBecomeSeller}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
      >
        Onboard with Stripe
      </button>
    </div>
  );
};

export default BecomeSellerComponent;
