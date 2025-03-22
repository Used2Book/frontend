"use client";
import React, { useState, useEffect } from "react";
import BookCard from "@/app/book/components/book";
import { Book } from "@/types/book";
import { allBooks } from "@/services/book";

const BookListCard: React.FC<{ books: Book[] }> = ({ books }) => {

    // const [bookList, setBookList] = useState<Book[]>(books);
    
    
      // useEffect(() => {
      //   // Fetch the book count when the component mounts
      //   const fetchBooks = async () => {
      //     const books = await allBooks();
      //     setBookList(books);
      //   };
    
      //   fetchBooks();
    
      // }, []);

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-9 gap-4 sm:gap-4 md:gap-4 lg:gap-6">
            {books.map((book) => (
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
    );
};

export default BookListCard;
