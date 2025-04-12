"use client";
import React, { useState, useEffect } from "react";
import { Book } from "@/types/book";
import UserLibraryCard from "@/app/user/components/user-library-card";
import { userLibrary } from "@/services/user";
import { getBookByID } from "@/services/book";


const UserLibraryList: React.FC<{clientID: number}> = ({clientID}) => {
    const [bookList, setBookList] = useState<Book[]>([]); // ✅ Store real book data
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLibrary = async () => {
            try {
                // Step 1: Fetch user library (only book IDs)
                const clientLibrary = await userLibrary(clientID);
                console.log("clientLibrary:", clientLibrary)
                if (!clientLibrary || clientLibrary.length === 0) {
                    setLoading(false);
                    return;
                }

                // Step 2: Fetch full book details for each book_id
                const bookDetailsPromises = clientLibrary.map(async (libraryItem : any) => {
                    const book = await getBookByID(libraryItem.book_id)
                    console.log("library book:", book)
                    return libraryItem ? {...book, reading_status: libraryItem.reading_status, library_id: libraryItem.id} : null;
                })

                // Step 3: Resolve all book fetches
                const books = await Promise.all(bookDetailsPromises);

                // Step 4: Filter out any failed fetches (null results)
                const validBooks = books.filter((book) => book !== null);

                // Step 5: Update state with real books
                setBookList(validBooks);
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
                <p className="text-center py-4">Loading your library ...</p>
            ) : bookList.length === 0 ? (
                <p className="text-center py-4 text-gray-400">No Book in the Library ...</p>
            ) : (
                <div className="flex space-x-6 overflow-x-auto py-4 scrollbar-hide mx-3">

                    {bookList.map((book) => (
                        <UserLibraryCard
                            key={book.id}
                            id={book.id}
                            title={book.title}
                            author={book.author}
                            cover_image_url={book.cover_image_url}
                            average_rating={book.average_rating}
                            reading_status={book.reading_status}
                            delete_={false}
                            library_id={book.library_id}
                        />
                    ))}
                </div>
            )}

        </div>
    );
};

export default UserLibraryList;
