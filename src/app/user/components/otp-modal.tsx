import { useState, useEffect, useRef } from "react";

interface OTPModalProps {
  otp: string;
  setOtp: (value: string) => void;
  onVerify: () => Promise<void>; // Updated to reflect async nature
  onResend: () => void;
  onClose: () => void;
  statusMessage: string;
  phone: string;
}

export default function OTPModal({
  otp,
  setOtp,
  onVerify,
  onResend,
  onClose,
  statusMessage,
  phone,
}: OTPModalProps) {
  const otpLength = 6;
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false); // New state for verifying

  // Handle input change for each digit
  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/, ""); // Only allow numbers
    if (value.length > 1) return; // Prevent multiple characters in one box

    let newOtp = otp.split("");
    newOtp[index] = value;
    setOtp(newOtp.join(""));

    // Move to next input if typing
    if (value && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
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

  // Handle Verify Click
  const handleVerifyClick = async () => {
    if (isVerifying) return;
    setIsVerifying(true);
    try {
      await onVerify();
    } catch (error) {
      console.error("Verification error:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  // Format timeLeft into MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white py-10 px-8 rounded shadow-md w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold mb-4">OTP Verification</h2>
        <p className="text-sm">
          Enter the code from the SMS sent to <span className="font-semibold">{phone}</span>{" "}
          <button
            onClick={onClose}
            className="text-blue-500 hover:underline"
          >
            Change
          </button>
        </p>

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
          The OTP will be expired in{" "}
          <span className="font-semibold text-blue-500">{formatTime(timeLeft)}</span>
        </p>

        {/* Resend Button */}
        <p className="text-sm text-center mb-4">
          Don’t receive the OTP?{" "}
          <button
            onClick={handleResend}
            className={`font-medium ${
              canResend ? "text-blue-500 hover:underline" : "text-gray-400 cursor-not-allowed"
            }`}
            disabled={!canResend}
          >
            Resend
          </button>
        </p>

        {/* Verify Button */}
        <button
          onClick={handleVerifyClick}
          className={`flex-1 p-2 rounded-md w-full transition ${
            isVerifying
              ? "bg-blue-300 text-white cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-700"
          }`}
          disabled={isVerifying}
        >
          {isVerifying ? "Verifying..." : "Verify"}
        </button>

        {/* Status Message */}
        {statusMessage && (
          <div className="mt-4 text-center text-blue-500">{statusMessage}</div>
        )}
      </div>
    </div>
  );
}