"use client";

import { useEffect, useState } from "react";
import { BookHeart, Search } from "lucide-react";
import { allBooks } from "@/services/book";
import { getUserWishlistByBookId } from "@/services/user";
import Image from "next/image";
import Link from "next/link";
import { User } from "@/types/user";
import { Book } from "@/types/book";
import NoAvatar from "@/assets/images/no-avatar.png";


export default function BookSearchSidebar() {
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);


  useEffect(() => {
    const fetchBooks = async () => {
      const fetchedBooks = await allBooks();
      setBooks(fetchedBooks);
    };
    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBookClick = async (book: Book) => {
    setUsers([]);
    setSelectedBook(book);
    setSearchQuery("");
    const users = await getUserWishlistByBookId(book.id);
    if (users) {
      setUsers(users);
    }
  };

  return (
    <div className="w-80 bg-white ml-10 p-4">
      <div className="flex space-x-2 items-center mb-4">
        <BookHeart size={18} />
        <h3 className="text-base font-bold">Find Interested Users</h3>
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 pr-10 border text-sm border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" size={20} />
        {searchQuery && filteredBooks.length > 0 && (
          <ul className="absolute z-10 bg-white w-full top-full mt-1 border rounded-lg shadow-md max-h-60 overflow-y-auto">
            {filteredBooks.map((book) => (
              <li
                key={book.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center space-x-2"
                onClick={() => handleBookClick(book)}
              >
                {book.cover_image_url && (
                  <Image
                    src={book.cover_image_url}
                    alt="cover"
                    width={30}
                    height={40}
                    className="rounded-sm border"
                  />
                )}
                <span>{book.title}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedBook && (
        <div className="mt-4">
          <div className="flex items-center space-x-3 mb-4">
            {selectedBook.cover_image_url && (
              <Image
                src={selectedBook.cover_image_url}
                alt="cover"
                width={30}
                height={40}
                className="rounded-sm border"
              />
            )}
            <span className="text-xs">{selectedBook?.title.length > 35 ? `${selectedBook?.title.slice(0, 35)}...` : selectedBook?.title}</span>
          </div>
          <h4 className="font-semibold text-sm mb-4">Users who are interested</h4>
          {users.length > 0 ? (
            <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {users.map((user) => (
                <li key={user.id} className="flex items-center space-x-3 bg-gray-100 rounded-md p-2">
                  <Link href={`/user/${user.id}`} className="flex items-center space-x-3 hover:underline">
                    <div className="flex">

                      <div className="relative w-8 h-8 rounded-full overflow-hidden">
                        <Image
                          src={user.picture_profile || NoAvatar}
                          alt={`${user.first_name} ${user.last_name}'s profile`}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    </div>
                    <span className="text-sm flex">
                      {user.first_name} {user.last_name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No users found.</p>
          )}
        </div>
      )}
    </div>
  );
}