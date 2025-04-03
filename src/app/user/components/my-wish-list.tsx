"use client";
import React, { useState, useEffect } from "react";
import { Book } from "@/types/book";
import { myWishList } from "@/services/user";
import BookCard from "@/app/book/components/book";
import UserLibraryCard from "@/app/user/components/user-library-card";
const MyWishList: React.FC = () => {
    const [bookList, setBookList] = useState<Book[]>([]); // ✅ Store real book data
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLibrary = async () => {
            try {
                // Step 1: Fetch user library (only book IDs)
                const myWishList_ = await myWishList();

                if (!myWishList_ || myWishList_.length === 0) {
                    setLoading(false);
                    return;
                }

                setBookList(myWishList_);
            } catch (error) {
                console.error("Error fetching library:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLibrary();
    }, []);

    return (
        // <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 place-items-center">
        <div className="w-full shadow-sm rounded-md min-h-0 overflow-hidden">
            {loading ? (
                <p className="text-center py-4">Loading your Wishlist ...</p>
            ) : bookList.length === 0 ? (
                <p className="text-center py-4">Adding some wish list ...</p>
            ) : (
                <div className="flex space-x-6 overflow-x-auto py-4 scrollbar-hide mx-3">

                    {bookList.map((book) => (
                        <BookCard
                            key={book.id}
                            id={book.id}
                            title={book.title}
                            author={book.author}
                            cover_image_url={book.cover_image_url}
                            average_rating={book.average_rating}
                        />
                    ))}
                </div>
            )}

        </div>
    );
};

export default MyWishList;
