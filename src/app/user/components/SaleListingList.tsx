"use client";
import React, { useState, useEffect } from "react";
import BookOwnerCard from "@/app/user/components/bookOwner";
import { Book } from "@/types/book";
import { myListing } from "@/services/user";
import { getBookByID, getBookListingByID } from "@/services/book"; // Fetch book details by ID
import SaleListingCard from "@/app/user/components/SaleListingCard";


const SaleListingList: React.FC<{bookID: number}> = ({bookID}) => {
    const [bookList, setBookList] = useState<Book[]>([]); // ✅ Store real book data
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                // Step 1: Fetch user listings (only book IDs & prices)
                const bookIDListings = await getBookListingByID(bookID);
                console.log("listing:", bookIDListings)
                if (!bookIDListings || bookIDListings.length === 0) {
                    setLoading(false);
                    return;
                }

                // Step 2: Fetch full book details for each book_id
                const bookDetailsPromises = bookIDListings.map(async (listing) => {
                    const book = await getBookByID(listing.book_id);
                    console.log("mare book:", book)
                    return book
                        ? { ...book, price: listing.price, status: listing.status, allow_offers: listing.allow_offers, seller_id: listing.seller_id, id: listing.id } // Merge listing details
                        : null;
                });
                // Step 3: Resolve all book fetches
                const books = await Promise.all(bookDetailsPromises);

                console.log("hey:",books)

                // Step 4: Filter out any failed fetches (null results)
                const validBooks = books.filter((book) => book !== null);

                // Step 5: Update state with real books
                setBookList(validBooks);
            } catch (error) {
                console.error("Error fetching user listings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    return (
        <div className="w-full bg-zinc-100 shadow-sm rounded-md">
            {loading ? (
                <p className="text-center py-4">Loading your listings...</p>
            ) : bookList.length === 0 ? (
                <p className="text-center py-4">No books listed for sale.</p>
            ) : (
                <div className="flex space-x-6 overflow-x-auto py-4 scrollbar-hide mx-3">
                    {bookList.map((book) => (
                        <SaleListingCard
                            key={book.id}
                            book={book}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SaleListingList;
