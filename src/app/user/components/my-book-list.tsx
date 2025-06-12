"use client";
import React, { useState, useEffect } from "react";
import { SaleBook } from "@/types/book";
import { myListing } from "@/services/user";
import { getBookByID } from "@/services/book"; // Fetch book details by ID
import SaleListingCard from "@/app/user/components/sale-listing-card";
const MyBookListCard: React.FC = () => {
    const [bookList, setBookList] = useState<SaleBook[]>([]); // ✅ Store real book data
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const myListings = await myListing();
                console.log("myListings:", myListings)
                if (!myListings || myListings.length === 0) {
                    setLoading(false);
                    return;
                }

                const bookDetailsPromises = myListings.map(async (listing: any) => {
                    const book = await getBookByID(listing.book_id);
                    return book
                        ? { ...book, price: listing.price, status: listing.status, allow_offers: listing.allow_offers, seller_id: listing.seller_id, id: listing.id, book_id: listing.book_id, image_urls: listing.image_urls }// Merge listing details
                        : null;
                });

                const books = await Promise.all(bookDetailsPromises);

                const validBooks = books.filter((book) => book !== null);

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
        <div className="w-full shadow-sm rounded-md">
            {loading ? (
                <p className="text-center py-4 text-gray-400">Loading your listings...</p>
            ) : bookList.length === 0 ? (
                <p className="text-center py-4 text-gray-400">No books listed for sale ...</p>
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

export default MyBookListCard;
