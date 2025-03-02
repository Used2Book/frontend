"use client";
import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import star_png from '@/assets/images/star.png';
import { Heart } from "lucide-react";
import { SaleBook } from "@/types/book";
import { getListingByID } from "@/services/user";
import toast from "react-hot-toast";
import { getGenresBookByID } from "@/services/book";
import { userProfile } from "@/services/user";
import Link from "next/link";
// export default function BookDetailCard({ bookId }: { bookId: string }) {
//     const [book, setBook] = useState(null);

//     useEffect(() => {
//       // Simulate API call or database fetch
//       fetch(`/api/books/${bookId}`)
//         .then((res) => res.json())
//         .then((data) => setBook(data));
//     }, [bookId]);

const SaleListingDetailCard: React.FC<{ book_listing: string, owner_id: number }> = ({ book_listing, owner_id }) => {
    const [bookId, listingId] = book_listing.split("_");

    const [listing, setListing] = useState<SaleBook | null>(null)
    const [loading, setLoading] = useState(true);

    const [seller, setSeller] = useState(null);


    useEffect(() => {
        if (!book_listing) return;
        console.log("book_listing:", book_listing)
        console.log("bookId - mare:", bookId)
        console.log("listingId - mare:", listingId)
        const fetchData = async () => {
            try {
                const fetchedListing = await getListingByID(parseInt(listingId));
                if (!fetchedListing) {
                    toast.error("Listing not found");
                    setLoading(false);
                    return;
                }
                console.log("fetched Listing:", fetchedListing.seller_id)

                const fetchedGenres = await getGenresBookByID(parseInt(bookId));
                const listingWithGenres = { ...fetchedListing, genres: fetchedGenres || [] };

                setListing(listingWithGenres);
                const seller_profile = await userProfile(fetchedListing.seller_id);
                setSeller(seller_profile)
            } catch (err) {
                toast.error("Error fetching book or genres");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [book_listing]);

    return (
        <div className="flex relative h-full w-full justify-start px-24 py-12 space-x-6 border-b-[1px] bg-white border-zinc-200 mb-5">
            {/* Book Cover Section */}
            <div className="flex-1 flex justify-start rounded-sm max-w-sm">
                {/* <div className="relative w-40 sm:w-52 md:w-60 lg:w-64 h-60 sm:h-72 md:h-80 lg:h-96"> */}
                <div className="flex flex-col">
                    <div className="relative w-8 sm:w-20 md:w-24 lg:w-40 h-24 sm:h-36 md:h-44 lg:h-64">
                        {listing &&
                            <Image
                                alt="Book cover"
                                src={listing.cover_image_url}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-sm border border-zinc-300"
                            />
                        }
                    </div>
                    <div className="w-full">
                        <Link href={`/user/${owner_id}/book/${listingId}/payment`}>
                            <div className="text-center bg-black text-white text-xxs font-bold w-full py-1 mt-2 rounded-sm shadow-md hover:bg-zinc-700 transition">
                                Buy
                            </div>
                        </Link>
                        <div className="flex justify-center items-center mt-2 w-full space-x-1">
                            {/* <div>
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
                            </div> */}
                            <button className="flex-1 font-bold text-xxs py-0.5 rounded-sm border-[1.5px] border-black shadow-md hover:bg-zinc-200 transition">
                                Make an Offer
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Book Info Section */}
            <div className="flex-2 justify-start space-y-2 text-sm p-4">
                <p className="text-lg font-bold">{listing?.title}</p>
                <div className="flex space-x-2 items-center">
                    <p className="text-sm font-bold">Author</p>
                    <p>{listing?.author}</p>
                </div>
                <div className="flex space-x-2 items-center">
                    <Image src={star_png} alt="rating" width={15} height={15} />
                    <p>{listing?.average_rating}</p>
                    <p className="text-zinc-400">({listing?.num_ratings})</p>
                </div>
                <p className="text-sm font-bold">Description</p>
                <p className="line-clamp-3">
                    {listing?.description}
                </p>
                <div className="flex space-x-2 items-center">
                    <p className="inline-block whitespace-nowrap font-bold">Genres</p>
                    <ul className="flex space-x-2">
                        {Array.isArray(listing?.genres) && listing.genres.map((genre, index) => (
                            <li
                                key={index}
                                className="bg-zinc-600 px-2 py-1 rounded-lg text-white text-xxs inline-block whitespace-nowrap"
                            >
                                {genre}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex space-x-2 items-center">
                    <p className="text-sm font-bold">Price </p>
                    <p>{listing?.price} Baht</p>
                </div>
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold">Seller's Note</p>
                    <p>No note yet ...</p>
                </div>

            </div>
        </div>
    );
};

export default SaleListingDetailCard;

