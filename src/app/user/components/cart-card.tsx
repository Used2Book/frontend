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
import SaleProfileCard from "@/app/user/components/sale-profile-card";
import { checkout } from "@/services/payment";


interface CartCardProps {
  cartDetail: Cart;
  onDelete: () => void;
}

const CartCard: React.FC<CartCardProps> = ({ cartDetail, onDelete }) => {
  const [seller, setSeller] = useState<User | null>(null)

  const user = useAuthStore((state) => state.user);
  const isSold = cartDetail.status === "sold"; // Check if item is sold
  const isReserved = cartDetail.status === "reserved";

  useEffect(() => {
    console.log("cartDetail:", cartDetail);
    const fetchSeller = async () => {
      console.log("cartDetail.seller_id:", cartDetail.seller_id);
      const seller_profile = await userProfile(cartDetail.seller_id);
      setSeller(seller_profile);
    };
    fetchSeller();
  }, [cartDetail.seller_id]);


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

  const handleCheckout = async () => {
    try {
      if (!user?.id) {
        toast.error("User ID not available.");
        return;
      }

      await checkout(cartDetail.listing_id, user?.id, 0); // 0 for no offerId

      toast.success("Redirect !!!");
    } catch (err) {
      console.error("Error to redirect:");
      toast.error("Failed to Redirect TT");
    }
  };

  
  const statusStyles: { [key: string]: string } = {
    for_sale: "bg-green-100 text-green-800",
    reserved: "bg-orange-100 text-orange-800",
    sold: "bg-red-100 text-red-800",
    removed: "bg-gray-100 text-gray-800",
  };
  return (
    <div className="flex-6 flex w-full bg-white">
      <div className="flex-1 flex justify-center items-center text-center">
        <Link href={`/user/${seller?.id}/book/${cartDetail.book_id}_${cartDetail.listing_id}`}>
          <div className="max-w-auto w-full h-20 sm:h-20 md:h-24 lg:h-28 relative bg-gray-200 aspect-[3/4] rounded-md">
            <Image
              alt="Book cover"
              src={cartDetail.image_url || "/placeholder.jpg"}
              fill
              sizes="100%"
              className="object-contain p-2"
            />
            {isSold && (
              <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold bg-black bg-opacity-50 rounded-sm">
                Sold
              </div>
            )}
          </div>
        </Link>
        <div className="flex flex-col ml-3 space-y-2">
          <Link href={`/user/${seller?.id}/book/${cartDetail.book_id}_${cartDetail.listing_id}`}>
            <p className={`font-semibold text-xs ${isSold ? "text-gray-500" : "hover:underline"}`}>
              {cartDetail.book_title.length > 20 ? `${cartDetail.book_title.slice(0, 20)}...` : cartDetail.book_title}
            </p>
          </Link>
          {seller?.id &&
            <SaleProfileCard id={seller?.id} />
          }
        </div>
      </div>
      {/* <div className="flex-1 flex text-center justify-center items-center ">
      </div> */}
      <div className="flex-1 flex text-center justify-center items-center ">
        <span
          className={`inline-block px-2 py-0.5 text-xxxs font-medium rounded-full text-center ${statusStyles[cartDetail.status] || "bg-gray-100 text-gray-800"
            }`}
        >
          {cartDetail.status.replace("_", " ").toUpperCase()}
        </span>

      </div>
      <div className="flex-1 flex text-center justify-center items-center">
        <p className={`font-bold ${isSold ? "text-gray-500 line-through" : ""}`}>
          {cartDetail.price} ฿
        </p>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <button
          className={`px-3 py-1 text-xs rounded-md transition-all duration-200 ease-in-out transform mx-2
      ${isSold || isReserved
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 active:scale-95"
            }`}
          disabled={isSold || isReserved}
          onClick={handleCheckout}
        >
          {isSold ? "Sold" : isReserved ? "Reserved" : "Pay Now"}
        </button>
      </div>
      <div className="flex-1 flex text-center justify-center items-center">
        <button
          onClick={handleDeleteCart}
          className="transition-all duration-200 ease-in-out text-gray-500 hover:text-red-700 hover:bg-red-200 p-2 bg-slate-100 rounded-md"
          title="Remove from Cart"
        // disabled={isSold}
        >
          <Trash2 size={18} />
        </button>
      </div>


      {/* <div className="flex items-center justify-between w-full pl-8 pr-12">
        <div className="flex flex-col items-start space-y-2">
          <p
            className={`text-xs italic text-ellipsis overflow-hidden whitespace-nowrap ${isSold ? "text-gray-500" : ""
              }`}
          >
            {cartDetail.book_author.length > 50
              ? `${cartDetail.book_author.slice(0, 50)}...`
              : cartDetail.book_author}
          </p>
          {seller && (
            <Link href={`/user/${seller.id}`}>
              <div
                className={`flex justify-center items-center py-1 pl-1 pr-2 rounded-md transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-100 hover:pr-5 ${isSold ? "bg-gray-600" : "bg-gray-600"
                  }`}
              >
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
                  className={`flex justify-start ml-2 text-xxs font-bold text-ellipsis overflow-hidden whitespace-nowrap ${isSold ? "text-gray-300" : "text-white"
                    }`}
                >
                  {seller.first_name} {seller.last_name}
                </p>
              </div>
            </Link>
          )}
        </div>
        <div className="flex items-center">
          <button
            onClick={handleDeleteCart}
            className="transition-all duration-200 ease-in-out text-gray-500 hover:text-red-700 hover:bg-red-200 p-2 bg-slate-100 rounded-md"
            title="Remove from Cart"
          // disabled={isSold}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default CartCard;