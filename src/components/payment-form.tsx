"use client";

import React, { useState, useEffect } from "react";
import { processPayment } from "@/services/user";
import toast from "react-hot-toast";

// Public Key from Environment Variables (Must be set)
const OMISE_PUBLIC_KEY = process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY || "";

interface PaymentFormProps {
  listingId: number;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ listingId }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expirationMonth, setExpirationMonth] = useState("");
  const [expirationYear, setExpirationYear] = useState("");
  const [cvc, setCvc] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load Omise.js from CDN
    const script = document.createElement("script");
    script.src = "https://cdn.omise.co/omise.js";
    script.async = true;
    script.onload = () => {
      (window as any).Omise.setPublicKey(OMISE_PUBLIC_KEY);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    const Omise = (window as any).Omise; // Ensure Omise.js is loaded

    if (!Omise) {
      toast.error("Omise SDK not loaded.");
      setLoading(false);
      return;
    }

    // Create a card token
    Omise.createToken("card", {
      number: cardNumber,
      expiration_month: expirationMonth,
      expiration_year: expirationYear,
      security_code: cvc,
    }, async (status: number, response: any) => {
      if (status === 200) {
        const token = response.id; // Omise Token for Payment
        console.log("Omise Token:", token);

        try {
          // Send Token to Backend for Payment Processing
          const { success, message } = await processPayment({
            listing_id: listingId,
            token,
          });

          if (success) {
            toast.success("Payment successful!");
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
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-lg font-bold mb-2">Make Payment</h2>
      <input type="text" placeholder="Card Number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="border p-2 mb-2 w-full"/>
      <div className="flex space-x-2">
        <input type="text" placeholder="MM" value={expirationMonth} onChange={(e) => setExpirationMonth(e.target.value)} className="border p-2 mb-2 w-1/3"/>
        <input type="text" placeholder="YY" value={expirationYear} onChange={(e) => setExpirationYear(e.target.value)} className="border p-2 mb-2 w-1/3"/>
        <input type="text" placeholder="CVC" value={cvc} onChange={(e) => setCvc(e.target.value)} className="border p-2 mb-2 w-1/3"/>
      </div>
      <button onClick={handlePayment} className="bg-blue-500 text-white p-2 rounded w-full" disabled={loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default PaymentForm;
