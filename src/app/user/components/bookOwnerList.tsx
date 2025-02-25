"use client";
import React, { useState, useEffect } from "react";
import BookOwnerCard from "@/app/user/components/bookOwner";
import { Book } from "@/types/book";
import { MyListing } from "@/services/user";
import { getBookByID } from "@/services/book"; // Fetch book details by ID

const BookOwnerListCard: React.FC = () => {
    const [bookList, setBookList] = useState<Book[]>([]); // ✅ Store real book data
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                // Step 1: Fetch user listings (only book IDs & prices)
                const myListings = await MyListing();
                if (!myListings || myListings.length === 0) {
                    setLoading(false);
                    return;
                }

                // Step 2: Fetch full book details for each book_id
                const bookDetailsPromises = myListings.map(async (listing) => {
                    const book = await getBookByID(listing.book_id);
                    return book
                        ? { ...book, price: listing.price, status: listing.status, allow_offers: listing.allow_offers } // Merge listing details
                        : null;
                });

                // Step 3: Resolve all book fetches
                const books = await Promise.all(bookDetailsPromises);

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
                        <BookOwnerCard
                            key={book.id}
                            id={book.id}
                            title={book.title}
                            author={book.author}
                            cover_image_url={book.cover_image_url}
                            rating={book.rating}
                            price={book.price} // ✅ Send price from listing
                            status={book.status} // ✅ Send listing status
                            allow_offers={book.allow_offers}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookOwnerListCard;
