"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Book } from "@/types/book";
import star_png from '@/assets/images/star.png';
import { bookInitialWishlistStatus, bookWishlistStatus } from "@/services/user"; // Import both functions
import { Heart } from "lucide-react";

const BookDetailCard: React.FC<{ bookDetail: Book }> = ({ bookDetail }) => {
    const [inWishlist, setInWishlist] = useState<boolean | null>(null);
    console.log("book genres:", bookDetail.genres)
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
                <div className="w-8 sm:w-20 md:w-24 lg:w-40">
                    {/* Image Container */}
                    <div className="relative h-24 sm:h-36 md:h-44 lg:h-64">
                        <Image
                            alt="Book cover"
                            src={bookDetail.cover_image_url}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="100%"
                            className="rounded-sm border border-zinc-300"
                        />
                    </div>
                    {/* Button matching image width */}
                    <button
                        onClick={handleWishlistToggle}
                        className={`
                            w-full text-sm mt-2 px-4 py-2 text-white rounded-md 
                            ${inWishlist ? "bg-red-500" : "bg-black"} 
                            transition-all duration-200 ease-in-out 
                            transform hover:scale-105 active:scale-95 
                            hover:bg-red-400 active:bg-red-600
                        `}
                    >
                        <div className="flex justify-center items-center space-x-2">
                            <Heart size={14} color="white" fill="white" />
                            <p>
                                {inWishlist ? "Wishlisted" : "Add to Wishlist"}
                            </p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Book Info Section */}
            <div className="flex flex-col justify-start space-y-5 text-sm p-4">
                <p className="text-lg font-bold">{bookDetail.title}</p>
                <p className=''>
                <ul className="flex space-x-2 italic text-gray-700">
                    <li className="mr-1">by</li>
                    {bookDetail?.author.map((author: any, index: any) => (
                      <li
                        key={index}
                        className="inline-block whitespace-nowrap"
                      >
                        {author}
                      </li>
                    ))}
                  </ul>
                </p>
                <div className="flex space-x-2 items-center">
                    <Image src={star_png} alt="rating" width={15} height={15} />
                    <p>{bookDetail.average_rating}</p>
                    <p className="text-zinc-400">({bookDetail.num_ratings})</p>
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
