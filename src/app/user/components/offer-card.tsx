// src/app/user/components/offer-card.tsx
"use client";
import Image from "next/image";
import { Offer } from "@/types/offer";
import { User } from "@/types/user";
import NoAvatar from "@/assets/images/no-avatar.png";
import { useState, useEffect, useCallback } from "react";
import useAuthStore from "@/contexts/auth-store";
import { userProfile } from "@/services/user";
import { removeOffer, acceptOffer, rejectOffer } from "@/services/offer";
import chatHttpClient from "@/lib/chat-http-client";
import { MessageCircleMore, Clock, CheckCircle, XCircle, Trash2, Check, X, CircleCheck } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface OfferCardProps {
  offerDetail: Offer;
  onUpdate: () => void;
  isBuyer: boolean;
}

const OfferCard: React.FC<OfferCardProps> = ({ offerDetail, onUpdate, isBuyer }) => {
  const [seller, setSeller] = useState<User | null>(null);
  const [chatLink, setChatLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchSeller = async () => {
      const sellerProfile = await userProfile(offerDetail.seller_id);
      setSeller(sellerProfile);
    };
    fetchSeller();
  }, [offerDetail.seller_id]);

  const handleStartChat = useCallback(async () => {
    if (!user || !seller) {
      setError("You must be logged in to start a chat.");
      return;
    }
    try {
      const response = await chatHttpClient.post("/chat/start", {
        senderId: String(user.id),
        receiverId: String(seller.id),
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

  const handleDeleteOffer = async () => {
    if (!isBuyer) return;
    try {
      const response = await removeOffer(offerDetail.listing_id);
      if (response.success) {
        toast.success("Offer removed successfully");
        onUpdate();
      } else {
        throw new Error("Deletion failed on the server");
      }
    } catch (error) {
      console.error("Error deleting offer:", error);
      toast.error("Failed to remove offer");
    }
  };

  const handleAcceptOffer = async () => {
    if (isBuyer) return;
    try {
      const response = await acceptOffer(offerDetail.id);
      if (response.success) {
        toast.success("Offer accepted successfully");
        onUpdate();
      } else {
        throw new Error("Acceptance failed on the server");
      }
    } catch (error) {
      console.error("Error accepting offer:", error);
      toast.error("Failed to accept offer");
    }
  };

  const handleRejectOffer = async () => {
    if (isBuyer) return;
    try {
      const response = await rejectOffer(offerDetail.id);
      if (response.success) {
        toast.success("Offer rejected successfully");
        onUpdate();
      } else {
        throw new Error("Rejection failed on the server");
      }
    } catch (error) {
      console.error("Error rejecting offer:", error);
      toast.error("Failed to reject offer");
    }
  };

  const statusConfig = {
    pending: { icon: <Clock size={16} />, color: "text-yellow-500", bg: "bg-yellow-100", border: "border-yellow-500" },
    accepted: { icon: <CheckCircle size={16} />, color: "text-green-500", bg: "bg-green-100", border: "border-green-500" },
    rejected: { icon: <XCircle size={16} />, color: "text-red-500", bg: "bg-red-100", border: "border-red-500" },
    completed: { icon: <CircleCheck size={16}/>, color: "text-blue-500", bg: "bg-blue-100", border: "border-blue-500" },
  };
  const currentStatus = statusConfig[offerDetail.status] || statusConfig.pending;

  return (
    <div className={`flex w-full space-x-2 bg-white rounded-r-lg p-4 border-l-[12px] ${currentStatus.border} shadow-md`}>
      <Link href={`/user/${seller?.id}/book/${offerDetail.book_id}_${offerDetail.listing_id}`}>
        <div className="relative w-6 sm:w-6 md:w-14 lg:w-16 h-10 sm:h-10 md:h-20 lg:h-24 ml-5">
          <Image
            alt="Book cover"
            src={offerDetail.image_url || offerDetail.cover_image_url || "/placeholder.jpg"}
            fill
            objectFit="cover"
            className="rounded-sm border border-zinc-300"
          />
        </div>
      </Link>
      <div className="flex items-center justify-between w-full pl-8 pr-12">
        <div className="flex flex-col items-start space-y-2">
          <Link href={`/user/${seller?.id}/book/${offerDetail.book_id}_${offerDetail.listing_id}`}>
            <p className="font-semibold text-sm hover:underline">{offerDetail.book_title}</p>
          </Link>
          <p className="text-xs italic text-ellipsis overflow-hidden whitespace-nowrap">
            {offerDetail.book_author.length > 50 ? `${offerDetail.book_author.slice(0, 50)}...` : offerDetail.book_author}
          </p>
          {/* Seller Info */}
          {seller && (
            <Link href={`/user/${seller.id}`}>
              <div className="flex justify-center items-center py-1 pl-1 pr-2 rounded-r-md bg-black transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-100 hover:pr-5">
                <div className="border-l-2 border-white">.</div>
                <div className="w-5 h-5 rounded-full overflow-hidden">
                  <Image src={seller.picture_profile || NoAvatar} alt="Seller Profile" width={50} height={50} />
                </div>
                <p className="flex justify-start ml-2 text-xxs font-bold text-ellipsis overflow-hidden whitespace-nowrap text-white">
                  {seller.first_name} {seller.last_name} (Seller)
                </p>
              </div>
            </Link>
          )}
          {/* Buyer Info (for sellers only) */}
          {!isBuyer && offerDetail.buyer_first_name && offerDetail.buyer_last_name && (
            <Link href={`/user/${offerDetail.buyer_id}`}>
              <div className="flex justify-center items-center py-1 pl-1 pr-2 rounded-r-md bg-gray-800 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-100 hover:pr-5">
                <div className="border-l-2 border-gray-300">.</div>
                <div className="w-5 h-5 rounded-full overflow-hidden">
                  <Image
                    src={offerDetail.buyer_picture_profile || NoAvatar}
                    alt="Buyer Profile"
                    width={50}
                    height={50}
                  />
                </div>
                <p className="flex justify-start ml-2 text-xxs font-bold text-ellipsis overflow-hidden whitespace-nowrap text-white">
                  {offerDetail.buyer_first_name} {offerDetail.buyer_last_name} (Buyer)
                </p>
              </div>
            </Link>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <p className="font-bold">{offerDetail.offered_price} ฿</p>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded ${currentStatus.bg} ${currentStatus.color}`}>
            {currentStatus.icon}
            <span className="text-sm capitalize">{offerDetail.status}</span>
          </div>
          {/* Buyer: Delete Offer (Pending) */}
          {isBuyer && offerDetail.status === "pending" && (
            <button
              onClick={handleDeleteOffer}
              className="text-red-500 hover:text-red-700 transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-95"
              title="Remove Offer"
            >
              <Trash2 size={18} />
            </button>
          )}
          {/* Seller: Accept/Reject (Pending) */}
          {!isBuyer && offerDetail.status === "pending" && (
            <div className="flex space-x-2">
              <button
                onClick={handleAcceptOffer}
                className="group relative p-2 rounded-full bg-green-100 text-green-500 hover:text-green-700 transition-all duration-300 ease-in-out transform hover:scale-110 hover:rotate-6 active:scale-95"
                title="Accept Offer"
              >
                <Check size={18} className="group-hover:animate-wobble" />
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Accept
                </span>
              </button>
              <button
                onClick={handleRejectOffer}
                className="group relative p-2 rounded-full bg-red-100 text-red-500 hover:text-red-700 transition-all duration-300 ease-in-out transform hover:scale-110 hover:-rotate-6 active:scale-95"
                title="Reject Offer"
              >
                <X size={18} className="group-hover:animate-wobble" />
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Reject
                </span>
              </button>
            </div>
          )}
          {/* Buyer: Pay Now (Accepted) */}
          {isBuyer && offerDetail.status === "accepted" && (
            <Link href={`/user/offer/${offerDetail.id}/payment`}>
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                title="Pay Now"
              >
                Pay Now
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferCard;