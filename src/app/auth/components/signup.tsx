"use client";
import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Link from "next/link";

const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID";

const SignUpModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleSuccess = (credentialResponse: any) => {
    console.log("Credential Response:", credentialResponse);
    closeModal();
  };

  const handleFailure = (error: any) => {
    console.error("Google Login Failed:", error);
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div>
        {/* Button to open the modal */}
        <Link
          href="/"
          className="bg-white text-black px-3 py-2 rounded-lg hover:bg-zinc-300 transition duration-200"
          onClick={(e) => {
            e.preventDefault(); // Prevent Link navigation
            openModal();
          }}
        >
          Sign up
        </Link>

        {/* Modal */}
        {isOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-black z-20"
            onClick={closeModal} // Close modal on background click
          >
            <div
              className="bg-white shadow-md rounded-lg px-14 py-20 w-1/3 flex-col space-y-7"
              onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
            >
              <p className="text-center text-medium font-bold mb-4">
                Create your Used2Book account
              </p>
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleFailure}
                text="signup_with"
              />
              <div className="flex justify-center items-center space-x-2">
                <div className="text-sm font-light text-zinc-500">
                Already have an account?
                </div>
                <Link href="/" className="text-blue-500 font-medium hover:underline" onClick={() => closeModal()}>
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default SignUpModal;
