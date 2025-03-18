"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { mockBookList } from "@/assets/mockData/books";
import { Book } from "@/types/book";
import star_png from '@/assets/images/star.png';
import { Heart } from "lucide-react";

// export default function BookDetailCard({ bookId }: { bookId: string }) {
//     const [book, setBook] = useState(null);

//     useEffect(() => {
//       // Simulate API call or database fetch
//       fetch(`/api/books/${bookId}`)
//         .then((res) => res.json())
//         .then((data) => setBook(data));
//     }, [bookId]);
const BookOwnerDetailCard: React.FC<{ bookDetail: Book }> = ({ bookDetail }) => {
    const [isWishlist, setIsWishlist] = useState(false);

    return (
        <div className="flex relative h-full w-full justify-start px-24 py-12 space-x-6 border-b-[1px] bg-white border-zinc-200 mb-5">
            {/* Book Cover Section */}
            <div className="flex-1 flex justify-start rounded-sm max-w-sm">
                {/* <div className="relative w-40 sm:w-52 md:w-60 lg:w-64 h-60 sm:h-72 md:h-80 lg:h-96"> */}
                <div className="flex flex-col">
                    <div className="relative w-8 sm:w-20 md:w-24 lg:w-40 h-24 sm:h-36 md:h-44 lg:h-64">

                        <Image
                            alt="Book cover"
                            src={bookDetail.cover_image_url}
                            fill
                            objectFit="cover"
                            className="rounded-sm border border-zinc-300"
                        />
                    </div>
                    <div className="w-full">
                        <button className="bg-black text-white text-xxs font-bold w-full py-1 mt-2 rounded-sm shadow-md hover:bg-zinc-700 transition">
                            Buy
                        </button>
                        <div className="flex justify-center items-center mt-2 w-full space-x-1">
                            <div>
                                {/* <Image src={Heart_Wish} alt="wishlist" width={12} height={12} /> */}
                                {/* Heart Button */}
                                <button
                                    onClick={() => setIsWishlist(!isWishlist)}
                                    className="w-6 h-6 flex justify-center items-center rounded-md transition"
                                >
                                    <Heart
                                        size={15} // Adjust size
                                        className={`transition ${isWishlist ? "fill-red-500 text-red-500" : "fill-none text-black hover:text-red-500"
                                            }`}
                                    />
                                </button>
                            </div>
                            <button className="flex-1 font-bold text-xxs py-0.5 rounded-sm border-[1.5px] border-black shadow-md hover:bg-zinc-200 transition">
                                Make an Offer
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Book Info Section */}
            <div className="flex-2 justify-start space-y-2 text-sm p-4">
                <p className="text-lg font-bold">{bookDetail.title}</p>
                <div className="flex space-x-2 items-center">
                    <p className="text-sm font-bold">Author</p>
                    <p>{bookDetail.author}</p>
                </div>
                <div className="flex space-x-2 items-center">
                    <Image src={star_png} alt="rating" width={15} height={15} />
                    <p>{bookDetail.rating}</p>
                </div>
                <p className="text-sm font-bold">Description</p>
                <p className="line-clamp-3">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
                <div className="flex space-x-2 items-center">
                    <p className="text-sm font-bold">Genres </p>
                    <ul className="flex space-x-2">
                        
                        {Array.isArray(bookDetail.genres) && bookDetail.genres.map((genre, index) => (
                            <li key={index} className="bg-zinc-600 px-2 py-1 rounded-lg text-white">{genre}</li>
                        ))}

                    </ul>
                </div>
                <div className="flex space-x-2 items-center">
                    <p className="text-sm font-bold">Price </p>
                    <p>{bookDetail.price} Baht</p>
                </div>
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold">Seller's Note</p>
                    <p>No note yet</p>
                </div>

            </div>
        </div>
    );
};

export default BookOwnerDetailCard;
