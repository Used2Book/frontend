"use client";
import { toast } from "react-hot-toast";
import React, { useState, useRef, useEffect } from "react";
import { sendOTP, verifyOTP, resendOTP } from "@/services/auth";
import { useRouter } from "next/navigation";
import { PhoneInput } from 'react-international-phone';
import { PhoneNumberUtil } from 'google-libphonenumber';
import "react-international-phone/style.css";
import { SendOTPResponse, VerifyOTPResponse } from "@/types/otp";



export default function OTPPage() {
    const phoneUtil = PhoneNumberUtil.getInstance();
    const isPhoneValid = (phone: string) => {
        try {
            return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
        } catch (error) {
            return false;
        }
    };
    const router = useRouter()
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [valid, setValid] = useState(true)

    const handleSendOTP = async () => {

        try {

            const isValid = isPhoneValid(phone)
            if (!isValid) {
                setValid(false)
            } else {
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

                router.push("/user/order");
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

