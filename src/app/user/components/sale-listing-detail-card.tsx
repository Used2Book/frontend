"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import star_png from "@/assets/images/star.png";
import { SaleBook } from "@/types/book";
import { getListingByID, userProfile } from "@/services/user";
import { addCart } from "@/services/cart";
import { addOffer } from "@/services/offer";
import { getGenresBookByID } from "@/services/book";
import toast from "react-hot-toast";
import Link from "next/link";
import { ShoppingBasket, ChevronLeft, ChevronRight, Handshake } from "lucide-react";
import useAuthStore from "@/contexts/auth-store";

const SaleListingDetailCard: React.FC<{ book_listing: string; owner_id: number }> = ({ book_listing, owner_id }) => {
  const [bookId, listingId] = book_listing.split("_");
  const [listing, setListing] = useState<SaleBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offeredPrice, setOfferedPrice] = useState<number | "">("");

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!book_listing) return;
    console.log("book_listing:", book_listing);
    console.log("bookId:", bookId);
    console.log("listingId:", listingId);

    const fetchData = async () => {
      try {
        const fetchedListing = await getListingByID(parseInt(listingId));
        if (!fetchedListing) {
          toast.error("Listing not found");
          setLoading(false);
          return;
        }
        console.log("Fetched Listing:", fetchedListing);

        const fetchedGenres = await getGenresBookByID(parseInt(bookId));
        const listingWithGenres = { ...fetchedListing, genres: fetchedGenres || [] };
        setListing(listingWithGenres);

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
      toast.success("Added to cart successfully:", res);
    } catch (err) {
      console.error("Error updating cart:", err);
      toast.error("Failed to add to cart");
    }
  };

  const handleAddOffer = async () => {
    if (offeredPrice === "" || offeredPrice <= 0) {
      toast.error("Please enter a valid offer price");
      return;
    }
    try {
      const res = await addOffer(parseInt(listingId), offeredPrice);
      toast.success("Offer submitted successfully");
      setIsOfferModalOpen(false);
      setOfferedPrice("");
    } catch (err) {
      console.error("Error submitting offer:", err);
      toast.error("Failed to submit offer");
    }
  };

  const openImageModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setCurrentImageIndex(0);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : (listing?.image_urls?.length || 1) - 1));
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev < (listing?.image_urls?.length || 1) - 1 ? prev + 1 : 0));
  };

  if (loading) return <p className="text-center py-4">Loading...</p>;
  if (error) return <p className="text-center text-red-500 py-4">{error}</p>;

  const maxGridImages = 4;
  const imageCount = listing?.image_urls?.length || 0;
  const mainImage = listing?.image_urls?.[0];
  const subImages = listing?.image_urls?.slice(1, maxGridImages) || [];
  const extraImages = imageCount > maxGridImages ? imageCount - maxGridImages : 0;
  const isSold = listing?.status === "sold"; // Check if listing is sold

  return (
    <div className="w-full justify-start items-center pb-3">
      <div className="flex justify-center items-center relative h-full space-x-6 p-8 shadow-sm rounded-md bg-white">
        <div className="flex rounded-sm max-w-sm">
          <div className="flex flex-col space-y-4">
            {/* Main Image */}
            <div className="relative w-52 h-72 cursor-pointer" onClick={() => openImageModal(0)}>
              {mainImage ? (
                <Image
                  alt="Listing main image"
                  src={mainImage}
                  fill
                  objectFit="cover"
                  className="rounded-sm border border-zinc-300"
                />
              ) : (
                <p className="text-center text-gray-400">No Image</p>
              )}
              {isSold && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-lg font-bold rounded-sm">
                  Sold Out
                </div>
              )}
            </div>

            {/* Sub Images */}
            {imageCount > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {subImages.map((url, i) => (
                  <div
                    key={i}
                    className="relative w-12 h-16 cursor-pointer"
                    onClick={() => openImageModal(i + 1)}
                  >
                    <Image
                      alt={`Listing image ${i + 1}`}
                      src={url}
                      fill
                      objectFit="cover"
                      className="rounded-sm border border-zinc-300"
                    />
                    {i === subImages.length - 1 && extraImages > 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xs rounded-sm">
                        +{extraImages} more
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Book Info Section */}
        <div className="flex flex-col justify-start space-y-4 text-sm p-4">
          <div>
            <Link href={`/book/${listing?.book_id}`} className="text-3xl font-bold hover:underline">
              {listing?.title || "Unknown Title"}
            </Link>
          </div>

          <div className="flex space-x-2 items-center text-zinc-600 italic">
            <p>{listing?.author || "Unknown"}</p>
          </div>

          <div className="flex space-x-2 items-center">
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

          <div className="flex flex-col space-y-2 my-2">
            <h4 className="text-base font-normal">Seller Note</h4>
            <p className="text-gray-600 text-sm sm:text-base">{listing?.seller_note}</p>
          </div>

          <div className="flex space-x-2 items-center">
            <p className={`font-bold text-2xl my-3 ${isSold ? "text-gray-500 line-through" : "text-orange-500"}`}>
              {listing?.price ? `${listing.price} ฿` : "Not available"}
            </p>
            {user?.id !== owner_id && listing?.allow_offers && !isSold && (
              <button
                className="flex items-center space-x-1 text-xs mt-2 text-blue-500 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-90 font-medium hover:underline"
                onClick={() => setIsOfferModalOpen(true)}
              >
                <Handshake size={16} />
                <span>( Make an Offer )</span>
              </button>
            )}
            {isSold && (
              <span className="text-red-500 font-medium text-sm mt-2">Sold Out</span>
            )}
          </div>

          {user?.id !== owner_id && (
            <div className="flex space-x-3 w-60">
              <button
                className={`flex justify-center items-center space-x-3 text-center font-bold text-xs rounded-sm border-[1.5px] border-black whitespace-nowrap shadow-md w-full px-10 py-2 transition-all duration-200 ease-in-out transform ${isSold ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "hover:bg-zinc-100 hover:scale-105 active:scale-90"}`}
                onClick={handleAddToCart}
                disabled={isSold}
              >
                <ShoppingBasket color={isSold ? "gray" : "black"} size={18} />
                <p>{isSold ? "Sold" : "Add To Cart"}</p>
              </button>
              <Link href={`/user/${owner_id}/book/${listingId}/payment`} className="w-full">
                <button
                  className={`text-center text-xs font-bold rounded-sm shadow-md w-full px-20 py-2 border-[1.5px] border-black transition-all duration-200 ease-in-out transform ${isSold ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-black text-white hover:bg-zinc-700 hover:scale-105 active:scale-90"}`}
                  disabled={isSold}
                >
                  {isSold ? "Sold" : "Buy"}
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && listing?.image_urls && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeImageModal}
        >
          <div
            className="relative max-w-3xl w-full p-4 flex items-center justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-600"
              onClick={prevImage}
            >
              <ChevronLeft size={24} />
            </button>
            <img
              src={listing.image_urls[currentImageIndex]}
              alt="Full Listing Image"
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-600"
              onClick={nextImage}
            >
              <ChevronRight size={24} />
            </button>
            <button
              className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-600"
              onClick={closeImageModal}
            >
              ✕
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded">
              {currentImageIndex + 1} / {imageCount}
            </div>
          </div>
        </div>
      )}

      {/* Offer Modal */}
      {isOfferModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsOfferModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Make an Offer</h2>
            <p className="text-sm text-gray-600 mb-2">
              Listing Price: <span className="font-bold">{listing?.price} ฿</span>
            </p>
            <div className="mb-4">
              <label htmlFor="offerPrice" className="block text-sm font-medium text-gray-700">
                Your Offer (฿)
              </label>
              <input
                type="number"
                id="offerPrice"
                value={offeredPrice}
                onChange={(e) => setOfferedPrice(e.target.value === "" ? "" : Number(e.target.value))}
                min="1"
                step="1"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your offer"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                onClick={() => setIsOfferModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={handleAddOffer}
              >
                Submit Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaleListingDetailCard;