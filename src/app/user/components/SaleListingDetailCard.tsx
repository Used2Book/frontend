"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import star_png from "@/assets/images/star.png";
import { SaleBook } from "@/types/book";
import { addCart, getListingByID, userProfile } from "@/services/user";
import { getGenresBookByID } from "@/services/book";
import toast from "react-hot-toast";
import Link from "next/link";
import { ShoppingBasket } from "lucide-react";

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

  const handleAddToCart = async () => {
      try {
        const res = await addCart(parseInt(listingId));
        toast.success("add to cart success fully")
      } catch (err) {
        console.error("Error updating wishlist status:", err);
      }
  };

  if (loading) return <p className="text-center py-4">Loading...</p>;
  if (error) return <p className="text-center text-red-500 py-4">{error}</p>;

  return (
    <div className="w-full justify-start items-center pb-3 mb-2">
      <div className="flex relative h-full space-x-6 p-8 shadow-sm rounded-md bg-white">
        <div className="flex justify-start rounded-sm max-w-sm">
          <div className="flex flex-col">
            <div className="relative w-8 sm:w-28 md:w-36 lg:w-52 h-24 sm:h-44 md:h-52 lg:h-72">
              {listing?.cover_image_url ? (
                <Image
                  alt="Book cover"
                  src={listing.cover_image_url}
                  fill
                  objectFit="cover"
                  className="rounded-sm border border-zinc-300"
                />
              ) : (
                <p className="text-center text-gray-400">No Image</p>
              )}
            </div>

            {/* Buy Button */}
            <div className="w-full">
              {/* <Link href={`/user/${owner_id}/book/${listingId}/payment`}>
              <div className="text-center bg-black text-white text-xxs font-bold w-full py-1 mt-2 rounded-sm shadow-md hover:bg-zinc-700 transition">
                Buy
              </div>
            </Link> */}

              {/* Offer Button */}
              {/* <div className="flex space-x-1">
                <button className="font-bold text-xxs py-0.5 rounded-sm border-[1.5px] border-black shadow-md hover:bg-zinc-200 transition w-full mt-2">
                  Make an Offer
                </button>
              </div> */}
            </div>
          </div>
        </div>

        {/* Book Info Section */}
        <div className="flex flex-col justify-start space-y-3 text-sm p-4">
          <div>
            <button className="text-3xl font-bold">{listing?.title || "Unknown Title"}</button>
          </div>

          <div className="flex space-x-2 items-center text-zinc-400 italic">
            {/* <p className="text-sm font-bold underline">Author</p> */}
            <p>{listing?.author || "Unknown"}</p>
          </div>

          <div className="flex space-x-2 items-center">
            {/* <p className="inline-block whitespace-nowrap font-bold underline">Genres</p> */}
            <ul className="flex space-x-2">
              {Array.isArray(listing?.genres) && listing.genres.length > 0 ? (
                listing.genres.map((genre, index) => (
                  <li
                    key={index}
                    className="bg-zinc-500 px-2 py-1 rounded-lg text-white text-xxs inline-block whitespace-nowrap"
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
            {/* <p className="inline-block whitespace-nowrap font-bold underline">Rating</p> */}

            <Image src={star_png} alt="rating" width={15} height={15} />
            <p>{listing?.average_rating || "N/A"}</p>
            <p className="text-zinc-400">({listing?.num_ratings || 0} reviews)</p>
          </div>

          {/* <p className="text-sm font-bold">Description</p>
        <p className="line-clamp-3">{listing?.description || "No description available"}</p> */}


          <div className="flex space-x-2 items-center">
            {/* <p className="text-sm font-bold">Price</p> */}
            <p className="font-bold text-2xl text-orange-500">{listing?.price ? `${listing.price} ฿` : "Not available"}</p>
            <button className="text-xs mt-2 text-blue-500  transition-all duration-200 ease-in-out 
                                              transform hover:scale-105 active:scale-90 
                                              font-medium hover:underline"
                    >
              ( Make an Offer )
            </button>
          </div>

          {/* <div className="flex flex-col space-y-1">
          <p className="text-sm font-bold">Seller's Note</p>
          <p>{listing?.sellerNote || "No note yet..."}</p>
        </div> */}
          <div className="flex space-x-3 w-60">
            <button className="flex justify-center items-center space-x-3 text-center 
            font-bold text-xs rounded-sm border-[1.5px] border-black whitespace-nowrap 
            shadow-md hover:bg-zinc-100 w-full px-10 py-2 transition-all 
            duration-200 ease-in-out transform hover:scale-105 active:scale-90"
              onClick={handleAddToCart}>
              <ShoppingBasket color="black" size={18} />
              <p>Add To Cart</p>
            </button>
            <Link href={`/user/${owner_id}/book/${listingId}/payment`} className="w-full">
              <button className="text-center bg-black text-white text-xs font-bold rounded-sm shadow-md hover:bg-zinc-700 px-20 py-2 border-[1.5px] border-black w-full transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-90">
                Buy
              </button>
            </Link>
          </div>


        </div>
      </div>
    </div>
  );
};

export default SaleListingDetailCard;
