"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import star_png from "@/assets/images/star.png";
import { SaleBook } from "@/types/book";
import { getListingByID, userProfile } from "@/services/user";
import { getGenresBookByID } from "@/services/book";
import toast from "react-hot-toast";
import Link from "next/link";

const SaleListingDetailCard: React.FC<{ book_listing: string; owner_id: number }> = ({ book_listing, owner_id }) => {
  const [bookId, listingId] = book_listing.split("_");

  const [listing, setListing] = useState<SaleBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!book_listing) return;
    console.log("book_listing:", book_listing);
    console.log("bookId:", bookId);
    console.log("listingId:", listingId);

    const fetchData = async () => {
      try {
        // 1️⃣ Fetch Listing Details
        const fetchedListing = await getListingByID(parseInt(listingId));
        if (!fetchedListing) {
          toast.error("Listing not found");
          setLoading(false);
          return;
        }
        console.log("Fetched Listing:", fetchedListing);

        // 2️⃣ Fetch Book Genres
        const fetchedGenres = await getGenresBookByID(parseInt(bookId));
        const listingWithGenres = { ...fetchedListing, genres: fetchedGenres || [] };
        setListing(listingWithGenres);

        // 3️⃣ Fetch Seller Profile
        const sellerProfile = await userProfile(fetchedListing.seller_id);
        setSeller(sellerProfile);
      } catch (err) {
        console.error("Error fetching book details:", err);
        setError("Error fetching book details.");
        toast.error("Error fetching book details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [book_listing, bookId, listingId]);

  if (loading) return <p className="text-center py-4">Loading...</p>;
  if (error) return <p className="text-center text-red-500 py-4">{error}</p>;

  return (
    <div className="flex relative h-full w-full justify-start px-24 py-12 space-x-6 border-b-[1px] bg-white border-zinc-200 mb-5">
      {/* Book Cover Section */}
      <div className="flex-1 flex justify-start rounded-sm max-w-sm">
        <div className="flex flex-col">
          {/* Book Cover */}
          <div className="relative w-8 sm:w-20 md:w-24 lg:w-40 h-24 sm:h-36 md:h-44 lg:h-64">
            {listing?.cover_image_url ? (
              <Image
                alt="Book cover"
                src={listing.cover_image_url}
                layout="fill"
                objectFit="cover"
                className="rounded-sm border border-zinc-300"
              />
            ) : (
              <p className="text-center text-gray-400">No Image</p>
            )}
          </div>

          {/* Buy Button */}
          <div className="w-full">
            <Link href={`/user/${owner_id}/book/${listingId}/payment`}>
              <div className="text-center bg-black text-white text-xxs font-bold w-full py-1 mt-2 rounded-sm shadow-md hover:bg-zinc-700 transition">
                Buy
              </div>
            </Link>

            {/* Offer Button */}
            <button className="flex-1 font-bold text-xxs py-0.5 rounded-sm border-[1.5px] border-black shadow-md hover:bg-zinc-200 transition w-full mt-2">
              Make an Offer
            </button>
          </div>
        </div>
      </div>

      {/* Book Info Section */}
      <div className="flex-2 justify-start space-y-2 text-sm p-4">
        <p className="text-lg font-bold">{listing?.title || "Unknown Title"}</p>

        <div className="flex space-x-2 items-center">
          <p className="text-sm font-bold">Author</p>
          <p>{listing?.author || "Unknown"}</p>
        </div>

        <div className="flex space-x-2 items-center">
          <Image src={star_png} alt="rating" width={15} height={15} />
          <p>{listing?.average_rating || "N/A"}</p>
          <p className="text-zinc-400">({listing?.num_ratings || 0})</p>
        </div>

        <p className="text-sm font-bold">Description</p>
        <p className="line-clamp-3">{listing?.description || "No description available"}</p>

        <div className="flex space-x-2 items-center">
          <p className="inline-block whitespace-nowrap font-bold">Genres</p>
          <ul className="flex space-x-2">
            {Array.isArray(listing?.genres) && listing.genres.length > 0 ? (
              listing.genres.map((genre, index) => (
                <li
                  key={index}
                  className="bg-zinc-600 px-2 py-1 rounded-lg text-white text-xxs inline-block whitespace-nowrap"
                >
                  {genre}
                </li>
              ))
            ) : (
              <p className="text-gray-400">No genres available</p>
            )}
          </ul>
        </div>

        <div className="flex space-x-2 items-center">
          <p className="text-sm font-bold">Price</p>
          <p>{listing?.price ? `${listing.price} Baht` : "Not available"}</p>
        </div>

        <div className="flex flex-col space-y-1">
          <p className="text-sm font-bold">Seller's Note</p>
          <p>{listing?.sellerNote || "No note yet..."}</p>
        </div>
      </div>
    </div>
  );
};

export default SaleListingDetailCard;
