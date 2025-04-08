// src/app/user/cart/page.tsx
"use client";
import { useEffect, useState } from "react";
import { myPurchaseListing } from "@/services/user";
import { MyOrder } from "@/types/order";
import toast from "react-hot-toast";
import Loading from "@/app/loading";
import MyOrderCard from "@/app/user/components/my-order-card";
import { myOrders } from "@/services/user";

export default function MyOrderPage() {
  const [orders, setOrders] = useState<MyOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const allOrders = await myOrders();
      setOrders(allOrders || []); // Ensure we set an empty array if null/undefined
    } catch (error) {
      console.error("Error fetching my orders:", error);
      toast.error("Failed to load my orders items");
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
      <div className="text-xl font-semibold mb-10">My Orders</div>

      <hr className="border-gray-200 mb-5"/>

      <div className="flex flex-col space-y-1">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">Your order is empty</p>
        ) : (
          orders.map((order) => (
            <div
              key={order?.transaction_time}
              className="text-sm font-medium transition-all duration-200"
            >
              <MyOrderCard order={order} />
              <hr className="border-gray-200 my-5"/>

            </div>
          ))
        )}
      </div>
    </div>
  );
}