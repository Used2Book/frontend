"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import star_png from "@/assets/images/star.png";
import { SaleBook } from "@/types/book";
import { addCart, getListingByID, userProfile } from "@/services/user";
import { getGenresBookByID } from "@/services/book";
import toast from "react-hot-toast";
import Link from "next/link";
import { ShoppingBasket, ChevronLeft, ChevronRight } from "lucide-react";
import useAuthStore from "@/contexts/auth-store";

const SaleListingDetailCard: React.FC<{ book_listing: string; owner_id: number }> = ({ book_listing, owner_id }) => {
  const [bookId, listingId] = book_listing.split("_");
  const [listing, setListing] = useState<SaleBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
      toast.success("Added to cart successfully");
    } catch (err) {
      console.error("Error updating cart:", err);
      toast.error("Failed to add to cart");
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

  return (
    <div className="w-full justify-start items-center pb-3">
      <div className="flex relative h-full space-x-6 p-8 shadow-sm rounded-md bg-white">
        <div className="flex justify-start rounded-sm max-w-sm">
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
            </div>

            {/* Sub Images */}
            {imageCount > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {subImages.map((url, i) => (
                  <div
                    key={i}
                    className="relative w-12 h-16 cursor-pointer"
                    onClick={() => openImageModal(i + 1)} // i + 1 because main image is 0
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
        <div className="flex flex-col justify-start space-y-3 text-sm p-4">
          <div>
            <Link href={`/book/${listing?.book_id}`} className="text-3xl font-bold hover:underline">{listing?.title || "Unknown Title"}</Link>
          </div>

          <div className="flex space-x-2 items-center text-zinc-400 italic">
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

          {/* <div className="flex space-x-2 items-center">
            <Image src={star_png} alt="rating" width={15} height={15} />
            <p>{listing?.average_rating || "N/A"}</p>
            <p className="text-zinc-400">({listing?.num_ratings || 0} reviews)</p>
          </div> */}

          <div className="flex space-x-2 items-center">
            <p className="font-bold text-2xl text-orange-500 my-5">{listing?.price ? `${listing.price} ฿` : "Not available"}</p>
            {user?.id !== owner_id && (
              <button className="text-xs mt-2 text-blue-500 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-90 font-medium hover:underline">
                ( Make an Offer )
              </button>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <h5>Seller Note</h5>
            <p className="text-gray-600 text-sm sm:text-base">{listing?.seller_note}</p>
          </div>


          {user?.id !== owner_id && (
            <div className="flex space-x-3 w-60">
              <button
                className="flex justify-center items-center space-x-3 text-center font-bold text-xs rounded-sm border-[1.5px] border-black whitespace-nowrap shadow-md hover:bg-zinc-100 w-full px-10 py-2 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-90"
                onClick={handleAddToCart}
              >
                <ShoppingBasket color="black" size={18} />
                <p>Add To Cart</p>
              </button>
              <Link href={`/user/${owner_id}/book/${listingId}/payment`} className="w-full">
                <button className="text-center bg-black text-white text-xs font-bold rounded-sm shadow-md hover:bg-zinc-700 px-20 py-2 border-[1.5px] border-black w-full transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-90">
                  Buy
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
    </div>
  );
};

export default SaleListingDetailCard;