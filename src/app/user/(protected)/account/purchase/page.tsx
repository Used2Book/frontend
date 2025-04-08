// src/app/user/cart/page.tsx
"use client";
import { getCart } from "@/services/cart";
import { useEffect, useState } from "react";
import CartCard from "@/app/user/components/cart-card";
import { myPurchaseListing } from "@/services/user";
import { MyPurchase } from "@/types/my-purchase";
import PurchaseCard from "@/app/user/components/purchase-card";
import toast from "react-hot-toast";
import Loading from "@/app/loading";

export default function PurchasePage() {
  const [orders, setOrders] = useState<MyPurchase[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const allOrders = await myPurchaseListing();
      setOrders(allOrders || []); // Ensure we set an empty array if null/undefined
    } catch (error) {
      console.error("Error fetching my purchase listings:", error);
      toast.error("Failed to load purchase listing items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  

  if (loading) return <Loading/>;

  return (
    <div className="w-full h-screen px-32 py-10">
      <div className="text-xl font-semibold mb-10">My Purchase</div>

      <hr className="border-gray-200 mb-5"/>

      <div className="flex flex-col space-y-1">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">Your purchase is empty</p>
        ) : (
          orders.map((order) => (
            <div
              key={order?.transaction_time}
              className="text-sm font-medium transition-all duration-200"
            >
              <PurchaseCard order={order} />
              <hr className="border-gray-200 my-5"/>

            </div>
          ))
        )}
      </div>
    </div>
  );
}