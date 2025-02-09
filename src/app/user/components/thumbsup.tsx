"use client";
import React, { useState } from "react";
import { ThumbsUp } from "lucide-react"; // Ensure you're importing the correct icon library

const ThumbsUpButton: React.FC = () => {
    const [isLiked, setIsLiked] = useState(false);

    return (
        <button
            onClick={() => setIsLiked(!isLiked)}
            className="w-8 h-8 flex justify-center items-center transition"
        >
            <ThumbsUp
                size={14} // Icon size
                className={`transition-all duration-300 ${isLiked
                    ? "fill-black text-black scale-110"
                    : "fill-none text-gray-400 hover:text-black"
                    }`}
            />
        </button>
    );
};

export default ThumbsUpButton;
