"use client";
import React, { useState, useEffect } from "react";
import BookCard from "@/app/book/components/book";
import { Book } from "@/types/book";
import { mockBookList } from "@/assets/mockData/books";
import { allBooks } from "@/services/book";
const BookListCard: React.FC = () => {
    const [bookList, setBookList] = useState<Book[]>([]);
    
    
      useEffect(() => {
        // Fetch the book count when the component mounts
        const fetchBooks = async () => {
          const books = await allBooks();
          setBookList(books);
        };
    
        fetchBooks();
    
      }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-7 gap-6">
            {bookList.map((book) => (
                <BookCard
                    key={book.id}
                    id={book.id}
                    title={book.title}
                    author={book.author}
                    cover_image_url={book.cover_image_url}
                    rating={book.rating}
                />
            ))}
        </div>
    );
};

export default BookListCard;
