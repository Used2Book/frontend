"use client";
import { useState, useEffect } from "react";

export default function Loading() {
  const [show, setShow] = useState(true);

  // Hide loading after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 1000);

    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  if (!show) return null; // Hide loading when timer ends

  return (
    <div className="flex flex-col items-center justify-center transition-opacity duration-500 opacity-100">
      <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent my-2"></div>
      <p className="text-xs text-gray-600 font-medium">Loading ...</p>
    </div>
  );
}
