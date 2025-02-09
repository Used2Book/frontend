"use client";
import React, { useState } from "react";
import BookCard from "@/app/book/components/book";
import { Book } from "@/types/book";
import { mockBookList } from "@/assets/mockData/books";

const BookListCard: React.FC = () => {
    const [bookList, setBookList] = useState<Book[]>(mockBookList);
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-9 gap-6">
            {bookList.map((book) => (
                <BookCard
                    key={book.id}
                    id={book.id}
                    title={book.title}
                    author={book.author}
                    image={book.image}
                    rating={book.rating}
                />
            ))}
        </div>
    );
};

export default BookListCard;
