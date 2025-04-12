// src/components/MyRecommendedBookList.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Book } from "@/types/book";
import { getRecommendedBooks } from "@/services/book";
import BookCard from "@/app/book/components/book";
const MyRecommendedBookList: React.FC = () => {
  const [bookList, setBookList] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const recommendedBooks = await getRecommendedBooks(49);
        console.log("Recommended books:", recommendedBooks);
        if (recommendedBooks && recommendedBooks.length > 0) {
          setBookList(recommendedBooks);
        }
      } catch (error) {
        console.error("Error fetching recommended books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, []);

  return (
    <div className="w-full rounded-md min-h-0 overflow-hidden">
      {loading ? (
        <p className="text-center py-4 text-gray-400">Loading your recommeded book ...</p>
      ) : bookList.length === 0 ? (
        <p className="text-center py-4 text-gray-400">Adding some book ...</p>
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

export default MyRecommendedBookList;