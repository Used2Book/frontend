// src/app/user/components/sale-listing-card.tsx
"use client";
import Image from "next/image";
import { SaleBook } from "@/types/book";
import NoAvatar from "@/assets/images/no-avatar.png";
import { useState, useEffect } from "react";
import { userProfile } from "@/services/user";
import Link from "next/link";

const SaleListingCard: React.FC<{ book: SaleBook }> = ({ book }) => {
    const [seller, setSeller] = useState<any>(null); // Adjust type if you have a User type

    useEffect(() => {
        const fetchSeller = async () => {
            try {
                console.log("book seller id:", book.seller_id);
                console.log("book:", book);
                const sellerProfile = await userProfile(book.seller_id);
                setSeller(sellerProfile);
            } catch (error) {
                console.error("Error fetching seller profile:", error);
            }
        };
        fetchSeller();
    }, [book.seller_id]);

    // Status styling
    const statusStyles: { [key: string]: string } = {
        for_sale: "bg-green-100 text-green-800",
        reserved: "bg-orange-100 text-orange-800",
        sold: "bg-red-100 text-red-800",
        removed: "bg-gray-100 text-gray-800",
    };

    return (
        <Link href={`/user/${book.seller_id}/book/${book.book_id}_${book.id}`}>
            <div className="flex flex-col p-2 bg-white border-2 border-gray-100 rounded-lg shadow-md w-20 sm:w-24 md:w-28 lg:w-28 hover:shadow-lg transition-shadow">

                {/* Seller Info */}
                <div className="flex justify-center items-center space-x-1 mb-2">
                    <div className="w-4 h-4 rounded-full overflow-hidden border border-gray-200">
                        <Image
                            src={seller?.picture_profile || NoAvatar}
                            alt="Seller Profile"
                            width={16}
                            height={16}
                            objectFit="cover"
                        />
                    </div>
                    <p className="text-xxs font-semibold text-gray-800 truncate">
                        {seller ? `${seller.first_name}` : "Loading..."}
                    </p>
                </div>

                {/* Book Image */}
                <div className="w-full h-20 sm:h-24 md:h-28 lg:h-28 relative">
                    {book?.image_urls?.[0] ? (
                        <Image
                            alt="Book cover"
                            src={book.image_urls[0]}
                            fill
                            objectFit="cover"
                            className="rounded-md border border-gray-200"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-md text-gray-400 text-xxs">
                            No Image
                        </div>
                    )}
                </div>

                {/* Book Details */}
                <div className="flex flex-col mt-2 space-y-1">
                    <h3 className="text-xxs font-semibold text-black truncate">
                        {book.title.length > 15 ? `${book.title.slice(0, 15)}...` : book.title}
                    </h3>
                    <p className="text-xxxs text-gray-500 truncate">
                        {book.author[0].length > 12 ? `${book.author[0].slice(0, 12)}...` : book.author[0]}
                    </p>

                    {/* Price and Offer */}
                    <div className="flex justify-between items-center mt-1 bg-zinc-100 rounded-md p-1">
                        <div className="text-start">
                            <p className="text-xxxs text-gray-600">Offer</p>
                            <p className="text-xxs font-bold text-black">{book.allow_offers ? "Yes" : "No"}</p>
                        </div>
                        <div className="text-end">
                            <p className="text-xxxs text-gray-600">Price</p>
                            <p className="text-xxs font-bold text-black">{book.price}฿</p>
                        </div>
                    </div>
                    {/* Status */}
                    <span
                        className={`inline-block px-1 py-0.5 text-xxxs font-medium rounded-full text-center ${statusStyles[book.status] || "bg-gray-100 text-gray-800"
                            }`}
                    >
                        {book.status.replace("_", " ").toUpperCase()}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default SaleListingCard;