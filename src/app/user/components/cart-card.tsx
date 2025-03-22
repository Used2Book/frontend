"use client";
import Image from "next/image";
import { Cart } from "@/types/cart";
import { User } from "@/types/user";
import NoAvatar from "@/assets/images/no-avatar.png";
import { useState, useEffect, useCallback } from "react";
import useAuthStore from "@/contexts/auth-store";
import { userProfile } from "@/services/user";
import { removeCart } from "@/services/cart";
import chatHttpClient from "@/lib/chat-http-client";
import { MessageCircleMore, Trash2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface CartCardProps {
  cartDetail: Cart;
  onDelete: () => void;
}

const CartCard: React.FC<CartCardProps> = ({ cartDetail, onDelete }) => {
  const [seller, setSeller] = useState<User | null>(null);
  const [chatLink, setChatLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const user = useAuthStore((state) => state.user);
  const isSold = cartDetail.status === "sold"; // Check if item is sold

  useEffect(() => {
    console.log("cartDetail:", cartDetail);
    const fetchSeller = async () => {
      console.log("cartDetail.seller_id:", cartDetail.seller_id);
      const seller_profile = await userProfile(cartDetail.seller_id);
      setSeller(seller_profile);
    };
    fetchSeller();
  }, [cartDetail.seller_id]);

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
      setError(null);
    } catch (error) {
      console.error("Error starting chat:", error);
      setError("Failed to start chat. Please try again.");
    }
  }, [user, seller]);

  const handleDeleteCart = async () => {
    try {
      const response = await removeCart(cartDetail.listing_id);
      if (response) { // Check if the backend confirms deletion
        toast.success("Item removed from cart successfully");
        onDelete(); // Trigger refetch
      } else {
        throw new Error("Deletion failed on the server");
      }
    } catch (error) {
      console.error("Error deleting cart item:", error);
      toast.error("Failed to remove item from cart");
    }
  };

  const chatButton = (
    <div
      className={`py-1 px-4 rounded-md border-2 transition-all duration-200 ease-in-out transform ${
        isSold
          ? "bg-gray-300 border-gray-400 cursor-not-allowed"
          : "hover:bg-sky-100 hover:border-sky-400 border-sky-200 hover:scale-105 active:scale-95"
      }`}
    >
      {chatLink ? (
        <Link href={chatLink} prefetch={false}>
          <MessageCircleMore size={15} color={isSold ? "gray" : "blue"} />
        </Link>
      ) : (
        <div
          onClick={!isSold ? handleStartChat : undefined}
          className={`flex items-center ${!isSold ? "cursor-pointer" : "cursor-not-allowed"}`}
        >
          <MessageCircleMore size={15} color={isSold ? "gray" : "blue"} />
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`flex w-full space-x-2 rounded-r-lg p-4 border-l-[12px] shadow-md ${
        isSold ? "bg-gray-100 border-gray-500" : "bg-white border-black"
      }`}
    >
      <Link href={`/user/${seller?.id}/book/${cartDetail.book_id}_${cartDetail.listing_id}`}>
        <div className="relative w-6 sm:w-6 md:w-14 lg:w-16 h-10 sm:h-10 md:h-20 lg:h-24 ml-5">
          <Image
            alt="Book cover"
            src={cartDetail.image_url || "/placeholder.jpg"}
            fill
            objectFit="cover"
            className={`rounded-sm border ${isSold ? "opacity-50" : "border-zinc-300"}`}
          />
          {isSold && (
            <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold bg-black bg-opacity-50 rounded-sm">
              Sold
            </div>
          )}
        </div>
      </Link>
      <div className="flex items-center justify-between w-full pl-8 pr-12">
        <div className="flex flex-col items-start space-y-2">
          <Link href={`/user/${seller?.id}/book/${cartDetail.book_id}_${cartDetail.listing_id}`}>
            <p className={`font-semibold text-sm ${isSold ? "text-gray-500" : "hover:underline"}`}>
              {cartDetail.book_title}
            </p>
          </Link>
          <p
            className={`text-xs italic text-ellipsis overflow-hidden whitespace-nowrap ${
              isSold ? "text-gray-400" : ""
            }`}
          >
            {cartDetail.book_author.length > 50
              ? `${cartDetail.book_author.slice(0, 50)}...`
              : cartDetail.book_author}
          </p>
          {seller && (
            <Link href={`/user/${seller.id}`}>
              <div
                className={`flex justify-center items-center py-1 pl-1 pr-2 rounded-r-md transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-100 hover:pr-5 ${
                  isSold ? "bg-gray-600" : "bg-black"
                }`}
              >
                <div className="border-l-2 border-white">.</div>
                <div className="w-5 h-5 rounded-full overflow-hidden">
                  <Image
                    src={seller.picture_profile || NoAvatar}
                    alt="Profile"
                    width={50}
                    height={50}
                    className={isSold ? "opacity-50" : ""}
                  />
                </div>
                <p
                  className={`flex justify-start ml-2 text-xxs font-bold text-ellipsis overflow-hidden whitespace-nowrap ${
                    isSold ? "text-gray-300" : "text-white"
                  }`}
                >
                  {seller.first_name} {seller.last_name}
                </p>
              </div>
            </Link>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <p className={`font-bold ${isSold ? "text-gray-500 line-through" : ""}`}>
            {cartDetail.price} ฿
          </p>
          <button
            onClick={handleDeleteCart}
            className={`transition-all duration-200 ease-in-out ${
              isSold ? "text-gray-400 cursor-not-allowed" : "text-red-500 hover:text-red-700"
            }`}
            title="Remove from Cart"
            disabled={isSold}
          >
            <Trash2 size={18} />
          </button>
          {/* {chatButton} */}
        </div>
      </div>
    </div>
  );
};

export default CartCard;