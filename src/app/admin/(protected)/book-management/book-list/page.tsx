// src/app/admin/books/page.tsx (adjust path as needed)
"use client";
import React, { useState, useEffect } from "react";
import { allBooks } from "@/services/book"; // Adjust import path
import Image from "next/image";
import { Book } from "@/types/book";
// Define Book type based on your backend model

const BookAdminManagementPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all books on mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const fetchedBooks = await allBooks();
        console.log("Fetched books:", fetchedBooks); // Debug
        setBooks(fetchedBooks);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Filter books based on search query
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 rounded-md shadow-md bg-white">
      <h1 className="text-2xl font-bold mb-6">Book Admin Management</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search books by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Book List */}
      {loading ? (
        <p className="text-gray-500">Loading books...</p>
      ) : filteredBooks.length > 0 ? (
        <div className="space-y-4">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="flex items-center space-x-4 p-4 border border-gray-200 rounded-md hover:bg-gray-50"
            >
              {book.cover_image_url && (
                <div className="relative w-12 h-16">
                  <Image
                    src={book.cover_image_url}
                    alt={book.title}
                    fill
                    objectFit="cover"
                    className="rounded-md border border-gray-300"
                  />
                </div>
              )}
              <div>
                <p className="text-lg font-semibold">{book.title}</p>
                <div className="text-sm text-gray-500">by
                  <ul className="flex space-x-2">
                    {book?.author.map((author: any, index: any) => (
                      <li
                        key={index}
                        className="inline-block whitespace-nowrap"
                      >
                        {author}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">
          {searchQuery ? "No books match your search." : "No books found."}
        </p>
      )}
    </div>
  );
};

export default BookAdminManagementPage;