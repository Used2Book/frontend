"use client";

import React, { useState } from "react";
import { createOmiseAccount } from "@/services/payment";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// Sample Bank Options (Thailand Banks)
const bankOptions = [
  { code: "bbl", name: "Bangkok Bank (BBL)" },
  { code: "scb", name: "Siam Commercial Bank (SCB)" },
  { code: "kbank", name: "Kasikorn Bank (KBANK)" },
  { code: "ktb", name: "Krungthai Bank (KTB)" },
  { code: "tmb", name: "TMBThanachart Bank (TTB)" },
];

const BecomeSellerComponent: React.FC = () => {
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankCode, setBankCode] = useState(bankOptions[0].code);
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const handleCancel = () => {
    router.push("/user/profile")
  }
  const handleBecomeSeller = async () => {
    if (!bankAccountNumber || !bankAccountName || !bankCode) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await createOmiseAccount({
        bank_account_number: bankAccountNumber,
        bank_account_name: bankAccountName,
        bank_code: bankCode,
      });

      if (response.success) {
        toast.success("Omise account created successfully!");
      } else {
        toast.error("Failed to create Omise account.");
      }
    } catch (error) {
      toast.error("Error creating Omise account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-lg mx-auto">
      <h2 className="text-medium font-semibold text-center mb-4">Become a Seller</h2>
      <p className="text-gray-600 text-center mb-6">
        Enter your bank details below to register with Omise and start selling.
      </p>

      <div className="space-y-4">
        {/* Account Holder Name */}
        <div>
          <label className="block font-medium text-sm mb-1">Account Holder Name</label>
          <input
            type="text"
            placeholder="Full Name (as on bank account)"
            value={bankAccountName}
            onChange={(e) => setBankAccountName(e.target.value)}
            className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Bank Account Number */}
        <div>
          <label className="block font-medium text-sm mb-1">Bank Account Number</label>
          <input
            type="text"
            placeholder="Enter your account number"
            value={bankAccountNumber}
            onChange={(e) => setBankAccountNumber(e.target.value)}
            className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Bank Selection Dropdown */}
        <div>
          <label className="block font-medium text-sm mb-1">Select Bank</label>
          <select
            value={bankCode}
            onChange={(e) => setBankCode(e.target.value)}
            className="border rounded-lg p-3 w-full bg-white focus:ring-2 focus:ring-blue-500"
            required
          >
            {bankOptions.map((bank) => (
              <option key={bank.code} value={bank.code}>
                {bank.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleBecomeSeller}
          className="w-full bg-black hover:bg-zinc-700 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center text-sm"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              <span>Processing...</span>
            </div>
          ) : (
            "Submit"
          )}
        </button>
        <button onClick={handleCancel} className="w-full border-black border-2 font-semibold py-1 rounded-lg transition flex items-center justify-center text-sm">Cancel</button>
      </div>
    </div>
  );
};

export default BecomeSellerComponent;
