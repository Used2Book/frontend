// src/app/user/offers/page.tsx
"use client";
import { getBuyerOffers, getSellerOffers } from "@/services/offer";
import { useEffect, useState } from "react";
import { Offer } from "@/types/offer";
import OfferCard from "@/app/user/components/offer-card";
import { Handshake } from "lucide-react";
import toast from "react-hot-toast";

export default function OfferPage() {
  const [buyerOffers, setBuyerOffers] = useState<Offer[]>([]);
  const [sellerOffers, setSellerOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"buyer" | "seller">("buyer");

  const fetchOffers = async () => {
    try {
      const [buyerData, sellerData] = await Promise.all([
        getBuyerOffers(),
        getSellerOffers(),
      ]);
      setBuyerOffers(buyerData || []);
      setSellerOffers(sellerData || []);
    } catch (error) {
      console.error("Error fetching offers:", error);
      toast.error("Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleUpdate = async () => {
    await fetchOffers(); // Refetch both lists after any update (delete, accept, reject)
  };

  if (loading) return <p className="text-center py-4">Loading...</p>;

  return (
    <div className="w-full bg-slate-100 h-screen px-32 py-10">
      <div className="flex items-center space-x-3 mb-5">
        <div className="text-3xl font-bold">Offers</div>
        <Handshake size={25} />
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-md ${activeTab === "buyer" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => setActiveTab("buyer")}
        >
          My Offers ({buyerOffers.length})
        </button>
        <button
          className={`px-4 py-2 rounded-md ${activeTab === "seller" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => setActiveTab("seller")}
        >
          Offers to Me ({sellerOffers.length})
        </button>
      </div>

      {/* Offer List */}
      <div className="flex flex-col w-full space-y-1">
        {activeTab === "buyer" ? (
          buyerOffers.length === 0 ? (
            <p className="text-center text-gray-500">You have no offers made</p>
          ) : (
            buyerOffers.map((offer) => (
              <div
                key={offer.id}
                className="p-3 text-sm font-medium transition-all duration-200"
              >
                <OfferCard offerDetail={offer} onUpdate={handleUpdate} isBuyer={true} />
              </div>
            ))
          )
        ) : (
          sellerOffers.length === 0 ? (
            <p className="text-center text-gray-500">No offers received</p>
          ) : (
            sellerOffers.map((offer) => (
              <div
                key={offer.id}
                className="p-3 text-sm font-medium transition-all duration-200"
              >
                <OfferCard offerDetail={offer} onUpdate={handleUpdate} isBuyer={false} />
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}