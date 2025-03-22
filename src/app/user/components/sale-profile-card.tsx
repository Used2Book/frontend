"use client"
import React from "react";
import { useState, useEffect, useCallback } from "react";
import { userProfile } from "@/services/user";
import Image from "next/image";
import NoAvatar from "@/assets/images/no-avatar.png";
import useAuthStore from "@/contexts/auth-store";
import chatHttpClient from "@/lib/chat-http-client";
import Link from "next/link";
import { MessageCircleMore } from "lucide-react";
const SaleProfileCard: React.FC<{ id: number }> = ({ id }) => {
    const [seller, setSeller] = useState(null);

    const [chatLink, setChatLink] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        // Fetch the book count when the component mounts
        const fetchSeller = async () => {
            console.log("book seller id :", id)
            console.log("book - :", id)
            const seller_profile = await userProfile(id);
            setSeller(seller_profile)
        };

        fetchSeller();

    }, []);

    // Use useCallback to memoize the chat initiation function
    const handleStartChat = useCallback(async () => {
        if (!user || !seller) {
            setError("You must be logged in to start a chat.");
            return;
        }

        try {
            const response = await chatHttpClient.post("/chat/start", {
                senderId: String(user.id),
                receiverId: String(seller?.id),
            });
            const chatId = response.data.chatId;
            if (!chatId.includes("-")) {
                throw new Error("Invalid chat ID format received from server.");
            }
            setChatLink(`/user/chat/${chatId}`);
            setError(null); // Clear any previous error
        } catch (error) {
            console.error("Error starting chat:", error);
            setError("Failed to start chat. Please try again.");
        }
    }, [user, seller]); // Ensure dependencies are correct

    // Only render the Link or button once, avoiding re-renders
    const chatButton = (
        <div className="p-2 hover:bg-sky-100 hover:border-sky-400 rounded-full border-sky-300 border-[1px] transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95">
            {chatLink ? (
                <Link href={chatLink} prefetch={false}>
                    <MessageCircleMore size={20} color="blue" />
                </Link>
            ) : (
                <button onClick={handleStartChat} className="flex items-center">
                    <MessageCircleMore size={20} color="blue" />
                </button>
            )}
        </div>
    );

    return (
        <div className="w-full bg-white px-8 py-3 shadow-sm rounded-md mb-2">
            <div className="flex justify-between w-full mt-1 border-gray-200">
                <div className="flex space-x-5 items-center">
                    <div className="flex justify-start w-10 h-10 rounded-full overflow-hidden">
                        <Image src={seller?.picture_profile ? seller?.picture_profile : NoAvatar} alt="Profile" width={50} height={50} />
                    </div>
                    <p className="flex justify-start ml-2 text-sm py-1 font-bold">{seller?.first_name} {seller?.last_name}</p>
                </div>
                {
                    user?.id !== id &&
                    <div>
                        {chatButton }
                    </div>
                }
            </div>
        </div>
    );
}

export default SaleProfileCard;