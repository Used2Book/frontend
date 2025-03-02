"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { processPayment } from "@/services/user"; // API call to backend
import toast from "react-hot-toast";

// 🔹 Omise Public Key (Use ENV Variable in Production)
const OMISE_PUBLIC_KEY = process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY || "pkey_test_12345";

const PaymentPage = ({ params }: { params: { book_listing: string } }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [securityCode, setSecurityCode] = useState("");

  const handlePayment = async () => {
    if (!cardNumber || !expiryMonth || !expiryYear || !securityCode) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    // Load Omise.js
    const Omise = (window as any).Omise;
    Omise.setPublicKey(OMISE_PUBLIC_KEY);

    // Create a card token
    Omise.createToken("card", {
      name: "Customer Name",
      number: cardNumber,
      expiration_month: expiryMonth,
      expiration_year: expiryYear,
      security_code: securityCode,
    }, async (status: number, response: any) => {
      if (status === 200) {
        const token = response.id; // Omise Token for Charge
        console.log("Omise Token:", token);

        try {
          // 🔹 Send Payment Request to Backend
          const { success, message } = await processPayment({
            listing_id: parseInt(params.book_listing),
            token,
          });

          if (success) {
            toast.success("Payment successful!");
            router.push("/user/orders"); // Redirect after payment
          } else {
            toast.error(message || "Payment failed.");
          }
        } catch (err) {
          toast.error("Error processing payment.");
        }
      } else {
        toast.error("Failed to create card token.");
      }
      setLoading(false);
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4">Enter Payment Details</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium">Card Number</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="•••• •••• •••• ••••"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div>
          <label className="block text-sm font-medium">Expiry Month</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="MM"
            value={expiryMonth}
            onChange={(e) => setExpiryMonth(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Expiry Year</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="YYYY"
            value={expiryYear}
            onChange={(e) => setExpiryYear(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Security Code</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="CVC"
          value={securityCode}
          onChange={(e) => setSecurityCode(e.target.value)}
        />
      </div>

      <button
        onClick={handlePayment}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default PaymentPage;
