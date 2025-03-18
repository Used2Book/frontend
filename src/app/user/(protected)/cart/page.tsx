"use client"
import Image from "next/image";
import { getCart } from "@/services/user";
import { useEffect, useState } from "react";
import { Cart } from "@/types/cart";
import CartCard from "@/app/user/components/cart";
import { ShoppingCart } from "lucide-react";
export default function CartPage() {
    const [carts, setCarts] = useState<Cart[]>([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCarts = async () => {
            try {
                const allCart = await getCart();
                if (allCart) {
                    setCarts(allCart);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching carts:", error);
                setLoading(false);
            }
        };
        fetchCarts();
    }, []);



    return (
        <div className="w-full bg-slate-100 h-screen px-32 py-10">
            <div className="flex items-center space-x-3 mb-5">
                <div className="text-3xl font-bold">My Cart</div>
                <ShoppingCart size={25} />
                <p>...</p>
            </div>
            <div className="flex flex-col w-full space-y-1">
                {carts.map((cart) => (
                    <button
                        key={cart?.id}
                        className="p-3 text-sm font-medium transition-all duration-200"
                    >
                        <CartCard cartDetail={cart}/>
                    </button>
                ))}
            </div>

        </div>
    );
}