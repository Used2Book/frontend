"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { SaleBook } from "@/types/book";
import { myListing, removeListing } from "@/services/user";
import { getBookByID } from "@/services/book";
import toast from "react-hot-toast";
import { Trash2, ChevronDown } from "lucide-react";
import useAuthStore from "@/contexts/auth-store";

const StorePage = () => {
    const [bookList, setBookList] = useState<SaleBook[]>([]);
    const [filteredBooks, setFilteredBooks] = useState<SaleBook[]>([]);
    const [loading, setLoading] = useState(true);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        if (!user) return;
        const fetchListings = async () => {
            try {
                const myListings = await myListing();
                if (!myListings || myListings.length === 0) {
                    setLoading(false);
                    return;
                }

                const bookDetailsPromises = myListings.map(async (listing:any) => {
                    const book = await getBookByID(listing.book_id);
                    return book
                        ? {
                            ...book,
                            price: listing.price,
                            status: listing.status,
                            allow_offers: listing.allow_offers,
                            seller_id: listing.seller_id,
                            id: listing.id,
                            book_id: listing.book_id,
                            image_urls: listing.image_urls,
                        }
                        : null;
                });

                const books = await Promise.all(bookDetailsPromises);
                const validBooks = books.filter((book) => book !== null) as SaleBook[];
                setBookList(validBooks);
                setFilteredBooks(validBooks);
            } catch (error) {
                console.error("Error fetching user listings:", error);
                toast.error("Failed to load your store");
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, [user]);

    useEffect(() => {
        if (selectedStatus === "all") {
            setFilteredBooks(bookList);
        } else {
            setFilteredBooks(
                bookList.filter((book: any) => book.status.replace(" ", "_") === selectedStatus)
            );
        }
    }, [selectedStatus, bookList]);

    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(event.target.value);
    };

    const handleRemoveListing = async (listingId: number) => {
        try {
            await removeListing(listingId);
            setBookList((prev) => prev.filter((book) => book.id !== listingId));
            toast.success("Listing removed successfully");
        } catch (error) {
            toast.error("Failed to remove listing");
        }
    };

    const initiateDelete = (listingId: number) => {
        setConfirmDeleteId(listingId);
    };

    const cancelDelete = () => {
        setConfirmDeleteId(null);
    };

    const confirmDelete = (listingId: number) => {
        handleRemoveListing(listingId);
        setConfirmDeleteId(null);
    };

    if (!user) {
        return <p className="text-center py-4">Please log in to manage your store.</p>;
    }

    if (loading) {
        return <p className="text-center py-4">Loading your store...</p>;
    }

    const bookToDelete = bookList.find((book) => book.id === confirmDeleteId);

    return (
        <div className="max-w-auto mx-20 my-5 p-6">
            {/* Header */}
            <h1 className="text-2xl font-semibold mb-10">My Store</h1>
            <div className="flex justify-between items-center mb-6">
                <div className="relative w-full max-w-xs">
                    <select
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        className="appearance-none w-full bg-white border border-gray-200 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 cursor-pointer"
                    >
                        <option value="all">ALL STATUS</option>
                        <option value="sold">SOLD</option>
                        <option value="reserved">RESERVED</option>
                        <option value="for_sale">FOR SALE</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronDown className="h-3 w-3 text-gray-600" />
                    </div>
                </div>
                <Link
                    href="/user/book/add-listing-book"
                    className="text-white bg-black rounded-md px-6 py-1.5 text-sm hover:bg-zinc-700 transition"
                >
                    + Add Book
                </Link>
            </div>

            {filteredBooks.length === 0 ? (
                <p className="text-center text-gray-500">
                    No listings match your filter.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {filteredBooks.map((book) => (
                        <div key={book.id} className="flex flex-col">
                            <Link href={`/user/${user.id}/book/${book.book_id}_${book.id}`}>
                                {/* <div className="max-w-xs w-full h-36 sm:h-36 md:h-40 lg:h-48 relative bg-gray-100">
                                    <Image
                                        src={book.image_urls[0] || "/placeholder.jpg"}
                                        alt={book.title}
                                        fill
                                        style={{ objectFit: "cover" }}
                                        className="py-4"
                                    /> */}
                                <div className="max-w-xs w-full h-36 sm:h-36 md:h-40 lg:h-48 relative bg-gray-100 aspect-[3/4] rounded-md">
                                    <Image
                                        src={book.image_urls[0] || "/placeholder.jpg"}
                                        alt={book.title}
                                        fill
                                        sizes="100%"
                                        className="object-contain py-4"
                                    />


                                    <button
                                        onClick={() => initiateDelete(book.id)}
                                        className={`absolute top-2 right-2 mt-1 flex items-center justify-start p-1 rounded-md bg-gray-200 text-sm text-gray-600 hover:text-red-600 transition-all duration-200 ${book.status === "sold"
                                            ? "text-gray-400 cursor-not-allowed"
                                            : "text-gray-600 hover:text-red-600 hover:bg-red-200"
                                            }`}
                                        title="Remove Listing"
                                        disabled={book.status === "sold"}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </Link>
                            <div className="mt-2 flex flex-col space-y-3">
                                <Link href={`/user/${user.id}/book/${book.book_id}_${book.id}`} className="flex flex-col space-y-3">
                                    <h2 className="text-sm font-bold text-gray-900 truncate">
                                        {book.title.length > 38 ? `${book.title.slice(0, 38)}...` : book.title}
                                    </h2>

                                    {/* <p className="text-xs text-gray-600">
                                        {book.author || "Unknown Author"}
                                        </p> */}
                                    <div className="flex justify-between items-center">
                                        <p className="text-base font-bold text-blue-600">
                                            {book.price} ฿
                                        </p>
                                        <span
                                            className={`px-2 py-0.5 text-[10px] font-semibold rounded-full text-white ${book.status === "sold"
                                                ? "bg-red-500"
                                                : book.status === "reserved"
                                                    ? "bg-yellow-500"
                                                    : "bg-green-500"
                                                }`}
                                        >
                                            {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                                        </span>

                                    </div>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {confirmDeleteId && bookToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                        <div className="flex flex-col justify-center items-center">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">
                                Confirm Deletion
                            </h2>
                            <p className="text-gray-600 mb-3 text-sm">
                                Are you sure you want to remove?
                            </p>
                            <p className="font-medium text-sm text-gray-800 mb-6 bg-red-100 px-2 py-1 rounded-md">
                                {bookToDelete.title}
                            </p>
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => confirmDelete(confirmDeleteId)}
                                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md transition-all duration-200"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StorePage;