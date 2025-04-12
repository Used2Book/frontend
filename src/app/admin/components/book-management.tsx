"use client";
import React, { useState, useEffect } from "react";
import { allBooks } from "@/services/book";
import Image from "next/image";
import { Book } from "@/types/book";
import { CircleFadingPlus, Search } from "lucide-react";
import Link from "next/link";
const BookAdminManagement: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const fetchedBooks = await allBooks();
        console.log("Fetched books:", fetchedBooks);
        setBooks(fetchedBooks);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 bg-white round-lg shadow-md">
      <div className="flex justify-between items-center px-5 mb-3">
        <h1 className="text-xl font-bold">Book Admin Management</h1>
        <Link
          href="/admin/book-management/insert-book"
          className="text-white bg-black rounded-md px-6 py-1.5 text-sm hover:bg-zinc-700 transition"
        >
          <div className="flex space-x-2 justify-center items-center">
            <CircleFadingPlus size={18} />
            <p>
              Add Book
            </p>
          </div>
        </Link>
      </div>

      <div className="relative mb-6 px-5">
        <Search className="absolute top-1/2 left-8 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search books by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <hr className="text-gray-500 mb-2 px-5" />
      <div className="flex justify-between text-xs font-semibold px-5 text-gray-500">
        <p>Book</p>
        <p className="text-gray-500">Edit</p>
      </div>
      <hr className="text-gray-500 mt-2 px-5" />

      {loading ? (
        <p className="text-gray-500 mt-2">Loading books...</p>
      ) : filteredBooks.length > 0 ? (
        <div className="h-[250px] overflow-y-auto space-y-2 mt-2 divide-y-2">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="flex items-center justify-between py-4 px-5"
            >
              <div className="flex items-center space-x-4">
                {book.cover_image_url && (
                  <div className="relative w-10 h-14">
                    <Image
                      src={book.cover_image_url}
                      alt={book.title}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-md border border-gray-300"
                    />
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold">{book.title}</p>
                  <p className="text-xs text-gray-500">
                    by {book.author?.join(", ").length > 30 ? `${book.author?.join(", ").slice(0, 30)}...` : book.author?.join(", ")}
                  </p>
                </div>
              </div>

              <div className="text-sm text-blue-600 cursor-pointer hover:underline">
                <Link href={`/admin/book-management/edit-book/${book.id}`}>
                  Edit
                </Link>
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

export default BookAdminManagement;
