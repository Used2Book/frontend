"use client"
import Image from "next/image";
import { Cart } from "@/types/cart";
import { User } from "@/types/user";
import NoAvatar from "@/assets/images/no-avatar.png";
import { useEffect, useState, useCallback } from "react";
import useAuthStore from "@/contexts/auth-store";
import { userProfile } from "@/services/user";
import chatHttpClient from "@/lib/chat-http-client";
import { MessageCircleMore } from "lucide-react";
import Link from "next/link";

const CartCard: React.FC<{ cartDetail: Cart }> = ({ cartDetail }) => {
    const [seller, setSeller] = useState<User | null>(null);

    const [chatLink, setChatLink] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        console.log("cartDetail:", cartDetail)
        // Fetch the book count when the component mounts
        const fetchSeller = async () => {
            console.log("cartDetail.seller_id:", cartDetail.seller_id)
            const seller_profile = await userProfile(cartDetail.seller_id);
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



    const chatButton = (
        <div className="py-1 px-4 hover:bg-sky-100 hover:border-sky-400 rounded-md border-sky-200 border-2 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95">
            {chatLink ? (
                <Link href={chatLink} prefetch={false}>
                    <MessageCircleMore size={15} color="blue" />
                </Link>
            ) : (
                <div onClick={handleStartChat} className="flex items-center cursor-pointer">
                    <MessageCircleMore size={15} color="blue" />
                </div>
            )}
        </div>
    );

    return (
        <Link href="#">
            <div className="flex w-full space-x-2 bg-white rounded-r-lg p-4 border-l-[12px] border-black shadow-md">
                <div className="relative w-6 sm:w-6 md:w-14 lg:w-16 h-10 sm:h-10 md:h-20 lg:h-24 ml-5">
                    <Image
                        alt="Book cover"
                        src={cartDetail.cover_image_url}
                        fill
                        objectFit="cover"
                        className="rounded-sm border border-zinc-300"
                    />
                </div>
                <div className="flex items-center justify-between w-full pl-8 pr-12">
                    <div className="flex flex-col items-start space-y-2">
                        <p className="font-semibold text-sm">{cartDetail.title}</p>
                        <p className="text-xs italic text-ellipsis overflow-hidden whitespace-nowrap">{cartDetail.author.length > 50 ? `${cartDetail.author.slice(0, 50)}...` : cartDetail.author}</p>
                        <div className="flex justify-center items-center py-1 pl-1 pr-2 rounded-r-md bg-black  transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-100 hover:pr-5">
                            <div className="border-l-2 border-white">.</div>
                            <div className="w-5 h-5 rounded-full overflow-hidden">
                                <Image src={seller?.picture_profile ? seller?.picture_profile : NoAvatar} alt="Profile" width={50} height={50} />
                            </div>
                            <p className="flex justify-start ml-2 text-xxs font-bold text-ellipsis overflow-hidden whitespace-nowrap text-white">{seller?.first_name} {seller?.last_name}</p>
                        </div>

                    </div>
                    <div className="flex">
                        <p className="font-bold">{cartDetail.price} ฿</p>
                    </div>
                </div>

                {/* <div className="flex flex-col border-gray-200 justify-center items-center p-2 rounded-md border-2 bg-black">
                    <div className="flex flex-col justify-center items-center">
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                            <Image src={seller?.picture_profile ? seller?.picture_profile : NoAvatar} alt="Profile" width={50} height={50} />
                        </div>
                        <p className="flex justify-start ml-2 text-xxs py-1 font-bold text-ellipsis overflow-hidden whitespace-nowrap text-white">{seller?.first_name} {seller?.last_name}</p>
                    </div>
                    <div>
                        {chatButton}
                    </div>
                </div> */}
            </div>
        </Link>

    );
}
export default CartCard