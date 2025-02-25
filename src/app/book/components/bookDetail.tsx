"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Book } from "@/types/book";
import star_png from '@/assets/images/star.png';
import { bookInitialWishlistStatus, bookWishlistStatus } from "@/services/user"; // Import both functions

const BookDetailCard: React.FC<{ bookDetail: Book }> = ({ bookDetail }) => {
    const [inWishlist, setInWishlist] = useState<boolean | null>(null);

    useEffect(() => {
        // Fetch the initial wishlist status when the component mounts
        const fetchInWishListStatus = async () => {
            const inWishlistStatus = await bookInitialWishlistStatus(bookDetail.id);
            setInWishlist(inWishlistStatus);
        };

        fetchInWishListStatus();
    }, [bookDetail.id]);

    const handleWishlistToggle = async () => {
        if (inWishlist !== null) {
            try {
                const updatedStatus = await bookWishlistStatus(bookDetail.id);
                setInWishlist(updatedStatus); // Update the wishlist status based on the API response
            } catch (err) {
                console.error("Error updating wishlist status:", err);
            }
        }
    };

    return (
        <div className="flex relative h-full w-full justify-start px-24 py-12 space-x-6 border-b-[1px] border-zinc-200 mb-5">
            {/* Book Cover Section */}
            <div className="flex-1 flex-col justify-start rounded-sm max-w-sm">
                <div className="relative w-8 sm:w-20 md:w-24 lg:w-40 h-24 sm:h-36 md:h-44 lg:h-64">
                    <Image
                        alt="Book cover"
                        src={bookDetail.cover_image_url}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-sm border border-zinc-300"
                    />
                </div>
                <button
                    onClick={handleWishlistToggle} // Handle button click to toggle wishlist status
                    // className={`w-full text-sm mt-2 px-4 py-2 text-white rounded-md ${inWishlist ? "bg-red-500" : "bg-black"}`}
                    className={`
                        w-full text-sm mt-2 px-4 py-2 text-white rounded-md 
                        ${inWishlist ? "bg-red-500" : "bg-black"} 
                        transition-all duration-200 ease-in-out 
                        transform hover:scale-105 active:scale-95 
                        hover:bg-red-400 active:bg-red-600
                      `}
                >
                    {inWishlist ? "Wishlisted" : "Add to Wishlist"}
                </button>
            </div>

            {/* Book Info Section */}
            <div className="flex-2 justify-start space-y-2 text-sm p-4">
                <p className="text-lg font-bold">{bookDetail.title}</p>
                <p className='italic'>by {bookDetail.author}</p>
                <div className="flex space-x-2 items-center">
                    <Image src={star_png} alt="rating" width={15} height={15} />
                    <p>{bookDetail.rating}</p>
                </div>
                <p className="line-clamp-3">
                    {bookDetail.description}
                </p>
                <div className="flex space-x-2 items-center">
                    <p className="inline-block whitespace-nowrap">Genres :</p>
                    <ul className="flex space-x-2">
                        {bookDetail?.genres.map((genre: any, index: any) => (
                            <li
                                key={index}
                                className="bg-zinc-600 px-2 py-1 rounded-lg text-white text-xxs inline-block whitespace-nowrap"
                            >
                                {genre}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default BookDetailCard;
