// src/app/user/cart/page.tsx
"use client";
import { getCart } from "@/services/cart";
import { useEffect, useState } from "react";
import { Cart } from "@/types/cart";
import CartCard from "@/app/user/components/cart-card";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

export default function CartPage() {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCarts = async () => {
    try {
      const allCart = await getCart();
      setCarts(allCart || []); // Ensure we set an empty array if null/undefined
    } catch (error) {
      console.error("Error fetching carts:", error);
      toast.error("Failed to load cart items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  const handleDeleteCart = async (listingId: number) => {
    try {
      await fetchCarts(); // Refetch after deletion
    } catch (error) {
      console.error("Error refreshing cart after deletion:", error);
      toast.error("Failed to refresh cart");
    }
  };

  if (loading) return <p className="text-center py-4">Loading...</p>;

  return (
    <div className="w-full h-screen px-32 py-10">
      <div className="text-xl font-semibold">My Cart</div>
      <div className="flex items-center space-x-3 mb-5">
        {/* <ShoppingCart size={25} />
        <p>...</p> */}
      </div>
      <div className="flex flex-col w-full space-y-1">
        {carts.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty</p>
        ) : (
          carts.map((cart) => (
            <div
              key={cart?.id}
              className="p-3 text-sm font-medium transition-all duration-200"
            >
              <CartCard cartDetail={cart} onDelete={() => handleDeleteCart(cart.listing_id)} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}