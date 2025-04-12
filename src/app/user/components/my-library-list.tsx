"use client";
import React, { useState, useEffect } from "react";
import { Book } from "@/types/book";
import UserLibraryCard from "@/app/user/components/user-library-card";
import { myLibrary } from "@/services/user";
import { getBookByID } from "@/services/book";
import toast from "react-hot-toast";

const myLibraryList: React.FC = () => {
  const [bookList, setBookList] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLibrary = async () => {
    try {
      const myLibrary_ = await myLibrary();

      if (!myLibrary_ || myLibrary_.length === 0) {
        setLoading(false);
        return;
      }

      const bookDetailsPromises = myLibrary_.map(async (libraryItem: any) => {
        const book = await getBookByID(libraryItem.book_id);
        return book
          ? { ...book, reading_status: libraryItem.reading_status, library_id: libraryItem.id }
          : null;
      });

      const books = await Promise.all(bookDetailsPromises);
      const validBooks = books.filter((book) => book !== null);

      setBookList(validBooks);
    } catch (error) {
      console.error("Error fetching library:", error);
      toast.error("Failed to fetch library");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  const handleDeleteBook = (library_id: number) => {
    // Update state directly by filtering out the deleted book
    setBookList((prevBooks) => prevBooks.filter((book) => book.library_id !== library_id));
  };

  return (
    <div className="w-full shadow-sm rounded-md min-h-0 overflow-hidden">
      {loading ? (
        <p className="text-center py-4">Loading your library ...</p>
      ) : bookList.length === 0 ? (
        <p className="text-center py-4 text-gray-400">Adding some book ...</p>
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
              delete_={true}
              library_id={book.library_id}
              onDelete={() => handleDeleteBook(book.library_id)} // Pass library_id
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default myLibraryList;