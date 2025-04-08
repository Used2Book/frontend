"use client";
import Image from "next/image";
import { MyOrder } from "@/types/order";
import NoAvatar from "@/assets/images/no-avatar.png";
import Link from "next/link";
import SaleProfileCard from "@/app/user/components/sale-profile-card";
import { useState } from "react";

const MyOrderCard: React.FC<{ order: MyOrder }> = ({ order }) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="flex w-full bg-white border rounded-lg shadow-sm hover:shadow-md px-6 py-4 transition-all duration-300 ease-in-out  ">
            {/* Book Info */}
            <div className="flex-1 flex items-center">
                <Link href={`/user/${order.buyer_id}/book/${order.book_id}_${order.listing_id}`}>
                    <div className="relative w-20 h-28 bg-gray-100 rounded-md overflow-hidden">
                        <Image
                            alt="Book cover"
                            src={order.image_url || "/placeholder.jpg"}
                            fill
                            sizes="100%"
                            className="object-contain p-2"
                        />
                    </div>
                </Link>
                <div className="ml-4 flex flex-col space-y-1">
                    <Link href={`/user/${order.buyer_id}/book/${order.book_id}_${order.listing_id}`}>
                        <p className="font-semibold text-sm hover:underline">
                            {order.book_title.length > 20 ? `${order.book_title.slice(0, 20)}...` : order.book_title}
                        </p>
                    </Link>
                    <SaleProfileCard id={order.buyer_id} />
                </div>
            </div>

            {/* Price and Date */}
            <div className="flex flex-col justify-center items-end text-right">
                <button
                    onClick={() => setShowModal(true)}
                    className="text-xs text-blue-500 hover:underline mt-1 mb-7"
                >
                    View buyer info
                </button>
                <div className="text-lg font-bold text-gray-800">{order.price} ฿</div>
                <div className="text-xs text-gray-500 mt-2">{order.transaction_time}</div>

            </div>

            {/* Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-blue-100 rounded-md p-5">

                            <div className="flex flex-col justify-center items-center space-y-2 mb-4">
                                <Image
                                    src={order.buyer_profile_image || NoAvatar}
                                    alt="Buyer"
                                    width={40}
                                    height={40}
                                    className="rounded-full object-cover"
                                />
                                <div className="text-sm font-semibold">
                                    {order.buyer_first_name} {order.buyer_last_name}
                                </div>
                            </div>

                            <div className="flex flex-col w-full justify-center items-center text-sm space-y-3">
                                <div className="flex flex-col w-full justify-center items-center space-y-2 bg-white rounded-md p-2">
                                    <span className="font-semibold">Phone Number</span>
                                    <span className="text-gray-600">{order.buyer_phone.String || "—"}</span>
                                </div>
                                <div className="flex flex-col w-full justify-center items-center space-y-2 bg-white rounded-md p-2">
                                    <span className="font-semibold">Address</span>
                                    <span className="whitespace-pre-wrap text-gray-600">{order.buyer_address || "-"}</span>
                                </div>
                            </div>

                        </div>
                            <div className="mt-6 text-right">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-1 text-sm rounded-md border border-gray-300 hover:bg-gray-100"
                                >
                                    Close
                                </button>
                            </div>
                    </div>

                </div>
            )}

        </div>
    );
};

export default MyOrderCard;
