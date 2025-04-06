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
import { Play } from "lucide-react";
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
        <Link href={`/user/${id}`} className="">
            <div className="flex space-x-3 items-center mt-1">
                <div className="flex space-x-3 items-center">
                    <div className="flex justify-start w-7 h-7 rounded-full overflow-hidden">
                        <Image src={seller?.picture_profile ? seller?.picture_profile : NoAvatar} alt="Profile" width={50} height={50} />
                    </div>
                    <p className="flex justify-start ml-2 text-xxs py-1 font-semibold hover:underline">{seller?.first_name} {seller?.last_name}</p>
                </div>

                <Play size={10} color="black" className="fill-black"/>
                {/* {
                    user?.id !== id &&
                    <div>
                        {chatButton }
                    </div>
                } */}
            </div>
        </Link>
    );
}

export default SaleProfileCard;