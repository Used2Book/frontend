// src/app/user/offers/[offerId]/payment/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { charge, userProfile } from "@/services/user";
import { getAcceptedOffer} from "@/services/offer";
import NoBackGround from "@/assets/images/no-background.jpg";
import NoAvatar from "@/assets/images/no-avatar.png";
import useAuthStore from "@/contexts/auth-store";

export default function PaymentPage({ params }: { params: Promise<{ offerId: string }> }) {
  const user = useAuthStore((state) => state.user);
  const resolvedParams = React.use(params);
  const offerId = parseInt(resolvedParams.offerId);

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [offer, setOffer] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!offerId) {
          toast.error("Invalid offer ID.");
          return;
        }
        const fetchedOffer = await getAcceptedOffer(offerId);
        if (!fetchedOffer) {
          toast.error("Offer not found or not accepted");
          return;
        }
        setOffer(fetchedOffer);

        const sellerProfile = await userProfile(fetchedOffer.seller_id);
        setSeller(sellerProfile);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Error fetching payment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [offerId]);

  useEffect(() => {
    if (expiresAt) {
      const interval = setInterval(() => {
        const remaining = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
        setTimeLeft(remaining);
        if (remaining <= 0) {
          setQrCodeUrl(null);
          setTimeLeft(null);
          toast.error("QR code expired. Please try again.");
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [expiresAt]);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const data = await charge(offer.listing_id, user?.id, offerId);
      if (data && data.success) {
        setQrCodeUrl(data.qr_code);
        setExpiresAt(data.expires_at);
        toast.success("Scan the QR code to complete payment!");
      } else {
        throw new Error(data?.message || "Payment initiation failed");
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      toast.error(err.message || "Error initiating payment.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center py-4">Loading...</p>;

  return (
    <div className="bg-white mt-10 mx-36 p-6 border border-gray-300 rounded-lg shadow-lg">
      <div className="flex p-10 justify-center">
        <div className="flex space-x-5 w-full">
          <div className="relative w-24 sm:w-36 md:w-44 lg:w-64 h-24 sm:h-36 md:h-44 lg:h-64">
            <Image
              alt="Book cover"
              src={offer?.image_url || NoBackGround}
              fill
              objectFit="cover"
              className="rounded-sm border border-zinc-300"
            />
          </div>
          <div className="flex flex-col justify-start space-y-3 text-sm p-4">
            <p className="text-xl font-bold">{offer?.book_title || "Unknown Title"}</p>
            <p className="flex space-x-2 items-center text-zinc-400 italic">
              {offer?.book_author
                ? offer.book_author.length > 50
                  ? `${offer.book_author.slice(0, 50)}...`
                  : offer.book_author
                : "Unknown Author"}
            </p>
            <div className="flex space-x-2 items-center py-2">
              <div className="flex justify-start w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src={seller?.picture_profile || NoAvatar}
                  alt="Profile"
                  width={50}
                  height={50}
                />
              </div>
              <p className="ml-2 text-sm py-1 font-bold">
                {seller?.first_name} {seller?.last_name}
              </p>
            </div>
            <p className="font-medium text-2xl">
              {offer?.offered_price ? `฿ ${offer.offered_price}` : "Not available"}
            </p>
          </div>
        </div>

        <div className="w-1/2">
          <h2 className="text-xl font-bold mb-4 text-center">Pay with PromptPay</h2>
          {qrCodeUrl ? (
            <div className="flex flex-col justify-center items-center text-center">
              <div className="relative w-28 h-48 md:w-32 md:h-52 lg:w-56 lg:h-80 border-[15px] border-white">
                <Image
                  src={qrCodeUrl}
                  alt="QR Code"
                  fill
                  objectFit="cover"
                  className="object-cover"
                />
              </div>
              <p className="mt-2">
                Scan this QR code with your PromptPay app. Expires at:{" "}
                {expiresAt && new Date(expiresAt).toLocaleString()}
              </p>
              {timeLeft !== null && (
                <p className="mt-2 text-sm text-gray-600">
                  Time left: {timeLeft} seconds
                </p>
              )}
              <p className="mt-2 text-sm text-gray-600">
                After payment, you’ll be redirected to your orders.
              </p>
            </div>
          ) : (
            <button
              onClick={handlePayment}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Processing..." : "Generate QR Code"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}