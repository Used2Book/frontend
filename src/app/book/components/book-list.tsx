"use client";
import React, { useState } from "react";
import BookCard from "@/app/book/components/book";
import { Book } from "@/types/book";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BookListCard: React.FC<{ books: Book[] }> = ({ books }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 27; // Adjust this number based on your needs

  // Calculate pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(books.length / booksPerPage);

  // Handle page changes
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4 sm:gap-4 md:gap-4 lg:gap-6">
        {currentBooks.map((book) => (
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
      
      {/* Pagination Controls */}
      {books.length > booksPerPage && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="p-2 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="p-2 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default BookListCard;