"use client";
import { toast } from "react-hot-toast";
import React, { useState, useRef, useEffect } from "react";
import { sendOTP, verifyOTP, resendOTP } from "@/services/auth";
import { useRouter } from "next/navigation";
import { PhoneInput } from 'react-international-phone';
import { PhoneNumberUtil } from 'google-libphonenumber';
import "react-international-phone/style.css";
interface SendOTPResponse {
  success: boolean;
  message: string;
}

interface VerifyOTPResponse {
  success: boolean;
  message: string;
}

const phoneUtil = PhoneNumberUtil.getInstance();
const isPhoneValid = (phone: string) => {
    try {
        return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
    } catch (error) {
        return false;
    }
};

export default function OTPPage() {
  const router = useRouter()
  // State for the phone number, OTP, modal visibility, and status message.
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [valid, setValid] = useState(true)

  // Handle sending the OTP.
  const handleSendOTP = async () => {
    
    
    try {

      const isValid = isPhoneValid(phone)
      if (!isValid) {
        setValid(false)
      }else{
        const res: SendOTPResponse = await sendOTP(phone);
        if (res.success) {
          setModalOpen(true);
          setStatusMessage(res.message || "OTP sent successfully");
        } else {
          setStatusMessage(res.message || "Failed to send OTP");
        }
      }
    } catch (error: any) {
      setStatusMessage(`Error: ${error.message}`);
    }
  };

  // Handle verifying the OTP.
  const handleVerifyOTP = async () => {
    setStatusMessage("");
    try {
      const res: VerifyOTPResponse = await verifyOTP(phone, otp);
      setStatusMessage(res.message || "");
      if (res.success) {
        // OTP verified successfully; close modal or redirect as needed.
        setModalOpen(false);
        toast.success("Verified Successfully!");

        router.push("/user/home");
      }

    } catch (error: any) {
      setStatusMessage(`Error: ${error.message}`);
    }
  };

  // Handle resending the OTP.
  const handleResendOTP = async () => {
    setStatusMessage("");
    try {
      const res: SendOTPResponse = await resendOTP(phone);
      setStatusMessage(res.message || "OTP resent successfully");
    } catch (error: any) {
      setStatusMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-14">
      {/* Left-Aligned Heading */}
      <h1 className="text-2xl font-bold">Phone Verification</h1>

      {/* Centered Form */}
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="flex flex-1 flex-col items-center justify-center w-full max-w-md">
          <label htmlFor="phone" className="block md:text-sm lg:text-sm font-semibold mb-1 text-center">
            Enter your phone number to receive a One-Time Password (OTP).
          </label>
          <label htmlFor="phone" className="block text-sm font-medium mb-4 text-center">
            This is required for account verification and security.
          </label>
          <PhoneInput
            defaultCountry="th"
            value={phone}
            onChange={(value) => setPhone(value)}
            prefix="+"
          />
          <button
            onClick={handleSendOTP}
            className="w-1/3 bg-black text-white py-2 rounded-full  hover:bg-gray-700 mt-6"
          >
            Send OTP
          </button>
          {!valid &&
            <div className="mt-4 text-center text-red-500 text-xs">Invalid phone number</div>
          }
          {statusMessage && (
            <div className="mt-4 text-center text-blue-600 text-xs">{statusMessage}</div>
          )}
        </div>
      </div>

      {/* OTP Modal */}
      {modalOpen && (
        <OTPModal
          otp={otp}
          setOtp={setOtp}
          onVerify={handleVerifyOTP}
          onResend={handleResendOTP}
          onClose={() => setModalOpen(false)}
          statusMessage={statusMessage}
          phone={phone}
        />
      )}
    </div>


  );
}

interface OTPModalProps {
  otp: string;
  setOtp: (value: string) => void;
  onVerify: () => void;
  onResend: () => void;
  onClose: () => void;
  statusMessage: string;
  phone: string;
}



function OTPModal({ otp, setOtp, onVerify, onResend, onClose, statusMessage, phone }: OTPModalProps) {
  const otpLength = 6;
  const inputRefs = useRef([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  // Handle input change for each digit
  const handleChange = (index, e) => {
    const value = e.target.value.replace(/\D/, ""); // Only allow numbers
    if (value.length > 1) return; // Prevent multiple characters in one box

    let newOtp = otp.split("");
    newOtp[index] = value;
    setOtp(newOtp.join(""));

    // Move to next input if typing
    if (value && index < otpLength - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Countdown Timer Logic
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true); // Enable resend button after countdown ends
    }
  }, [timeLeft]);

  // Handle Resend OTP
  const handleResend = () => {
    setTimeLeft(300); // Reset countdown to 5 minutes
    setCanResend(false);
    onResend(); // Call the resend function
  };

  // Format timeLeft into MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white py-10 px-8 rounded shadow-md w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold mb-4">OTP Verification</h2>
        <p className="text-sm">Enter the code from the SMS sent to <label className="font-semibold">{phone}</label> <button
            onClick={onClose}
            className="text-blue-500 hover:underline"
          >
            Change
          </button></p>

        {/* OTP Input Boxes */}
        <div className="flex justify-center gap-2 my-6">
          {Array.from({ length: otpLength }, (_, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              value={otp[index] || ""}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              maxLength={1}
              className="w-12 h-12 border border-gray-400 text-center text-lg rounded 
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
          ))}
        </div>

        {/* Countdown Timer */}
        <p className="text-sm text-gray-400 mb-3">
          The OTP will be expired in <span className="font-semibold text-blue-500">{formatTime(timeLeft)}</span>
        </p>

        {/* Resend Button */}
        <p className="text-sm text-center mb-4">
          Don’t receive the OTP?{" "}
          <button
            onClick={handleResend}
            className={`font-medium ${canResend ? "text-blue-500 hover:underline" : "text-gray-400 cursor-not-allowed"}`}
            disabled={!canResend}
          >
            Resend
          </button>
        </p>

        {/* Buttons */}
        <button
          onClick={onVerify}
          className="flex-1 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 w-full"
        >
          Verify
        </button>


        {/* Status Message */}
        {statusMessage && (
          <div className="mt-4 text-center text-blue-500">{statusMessage}</div>
        )}
      </div>
    </div>
  );
}



