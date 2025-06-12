"use client";
import Image from "next/image";
import Link from "next/link";
import SaleProfileCard from "@/app/user/components/sale-profile-card";
import { MyPurchase } from "@/types/my-purchase";


const PurchaseCard: React.FC<{ order: MyPurchase }> = ({ order }) => {

    return (
        <div className="flex-6 flex w-full bg-white">
            <div className="flex-1 flex justify-start items-center text-center">
                <Link href={`/user/${order.seller_id}/book/${order.book_id}_${order.listing_id}`}>
                    <div className="max-w-auto w-full h-20 sm:h-20 md:h-24 lg:h-28 relative bg-gray-200 aspect-[3/4] rounded-md">
                        <Image
                            alt="Book cover"
                            src={order.image_url || "/placeholder.jpg"}
                            fill
                            sizes="100%"
                            className="object-contain p-2"
                        />
                    </div>
                </Link>
                <div className="flex flex-col ml-3 space-y-2">
                    <Link href={`/user/${order.seller_id}/book/${order.book_id}_${order.listing_id}`}>
                        <p className="font-semibold text-xs text-start">
                            {order.book_title.length > 20 ? `${order.book_title.slice(0, 20)}...` : order.book_title}
                        </p>
                    </Link>
                    <SaleProfileCard id={order.seller_id} />
                    <p className="text-start text-xs p-1 bg-sky-100 rounded-full">
                        Tel: <span className="text-blue-500">{order.seller_phone}</span>
                    </p>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center items-end p-2">
                <div className="font-bold">
                    {order.price} ฿
                </div>
                <div className="flex space-x-2 text-xs text-gray-400 mt-2">
                    <p>Date:</p>
                    <p>{new Date(order.transaction_time).toLocaleString()}</p>
                </div>
            </div>






        </div>
    );
};

export default PurchaseCard;