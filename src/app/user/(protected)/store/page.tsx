"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { myListing, removeListing } from "@/services/user";
import { UserListing } from "@/types/listing";
import useAuthStore from "@/contexts/auth-store";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

const MyStorePage = () => {
    const [listings, setListings] = useState<UserListing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        if (!user) return;
        const fetchListings = async () => {
            try {
                const data = await myListing();
                setListings(data);
            } catch (err) {
                setError("Failed to load your listings");
                toast.error("Failed to load your listings");
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, [user]);

    const handleRemoveListing = async (listingId: number) => {
        if (!confirm("Are you sure you want to remove this listing?")) return;
        try {
            await removeListing(listingId);
            setListings((prev) => prev.filter((listing) => listing.id !== listingId));
            toast.success("Listing removed successfully");
        } catch (err) {
            toast.error("Failed to remove listing");
        }
    };

    if (!user) {
        return <p className="text-center py-4">Please log in to manage your store.</p>;
    }

    if (loading) {
        return <p className="text-center py-4">Loading your store...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500 py-4">{error}</p>;
    }

    return (
        <div className="max-w-4xl mx-auto my-8 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">My Store</h1>
                <Link
                    href="/user/book/add-book"
                    className="text-white bg-black rounded-md px-10 py-2 text-sm hover:bg-zinc-700 transition"
                >
                    Add Book
                </Link>
            </div>
            {listings.length === 0 ? (
                <p className="text-center text-gray-500">You have no active listings. Add a book to get started!</p>
            ) : (
                <div className="space-y-4">
                    {listings.map((listing) => (
                        <div
                            key={listing.id}
                            className="flex items-center bg-white p-4 rounded-lg shadow-md border-l-8 border-black"
                        >
                            <Link href={`/user/${user.id}/book/${listing.book_id}_${listing.id}`}>
                                <div className="relative w-16 h-24">
                                    <Image
                                        src={listing.image_urls[0] || "/placeholder.jpg"}
                                        alt="Book cover"
                                        fill
                                        objectFit="cover"
                                        className="rounded-sm border border-zinc-300"
                                    />
                                </div>
                            </Link>
                            <div className="flex-1 ml-6">
                                <Link href={`/user/${user.id}/book/${listing.book_id}_${listing.id}`}>
                                    <h2 className="text-lg font-semibold hover:underline">
                                        Book ID: {listing.book_id}
                                    </h2>
                                </Link>
                                <p className="text-sm text-gray-600">
                                    Price: <span className="font-bold">{listing.price} ฿</span>
                                </p>
                                <p className="text-sm text-gray-600">
                                    Offers Allowed: {listing.allow_offers ? "Yes" : "No"}
                                </p>
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => handleRemoveListing(listing.id)}
                                    className="text-red-500 hover:text-red-700 transition-all duration-200 ease-in-out"
                                    title="Remove Listing"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyStorePage;