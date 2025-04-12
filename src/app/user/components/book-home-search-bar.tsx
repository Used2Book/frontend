// src/components/BookHomeSearchBar.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { allBooks } from "@/services/book";
import Image from "next/image";
import Link from "next/link";

const BookHomeSearchBar: React.FC = () => {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState<{ id: number; title: string; cover_image_url: string }[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<
    { id: number; label: string; image: string }[]
  >([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fetch books on mount
  useEffect(() => {
    const fetchBooks = async () => {
      const fetchedBooks = await allBooks();
      setBooks(fetchedBooks);
    };
    fetchBooks();
  }, []);

  // Update filtered books and dropdown state when search changes
  useEffect(() => {
    const filtered = books
      .map((book) => ({
        id: book.id,
        label: book.title,
        image: book.cover_image_url,
      }))
      .filter((book) => book.label.toLowerCase().includes(search.toLowerCase()));
    setFilteredBooks(filtered);
    setIsDropdownOpen(search !== "" && filtered.length > 0); // Open dropdown if there's a search and results
  }, [search, books]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleBookSelect = () => {
    setSearch(""); // Clear search to close dropdown
    setIsDropdownOpen(false); // Explicitly close dropdown
  };

  return (
    <nav className="bg-white flex justify-center w-full py-2 shadow-md">
      <div className="flex w-full max-w-5xl items-center space-x-4">
        {/* 🔍 Search Input */}
        <div className="relative flex-grow" ref={wrapperRef}>
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => {
              if (filteredBooks.length > 0) setIsDropdownOpen(true); // Reopen dropdown on focus if results exist
            }}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-white text-black shadow-md focus:outline-none"
          />
          {/* Dropdown for search results */}
          {isDropdownOpen && (
            <ul className="absolute w-full mt-2 border bg-white rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {filteredBooks.map((book) => (
                <li key={book.id} className="px-4 py-2 hover:bg-gray-100">
                  <Link href={`/book/${book.id}`} passHref>
                    <div
                      className="flex space-x-3 items-center cursor-pointer"
                      onClick={handleBookSelect}
                    >
                      <div className="relative w-12 h-16">
                        <Image
                          alt="Book cover"
                          src={book.image}
                          fill
                          objectFit="cover"
                          className="rounded-sm border border-zinc-300 shadow-md"
                        />
                      </div>
                      <div className="flex flex-col">
                        <p className="text-xs font-semibold text-black truncate">
                          {book.label.length > 50 ? `${book.label.slice(0, 50)}...` : book.label}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default BookHomeSearchBar;