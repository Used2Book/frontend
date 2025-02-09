"use client";
import React, { useState } from "react";
import BookCard from "@/app/book/components/book";
import { Book } from "@/types/book";
import { mockBookList } from "@/assets/mockData/books";
import BookOrderCard from "@/app/user/components/bookOrder";
import { mockBookCarouselList } from "@/assets/mockData/books";
import BookOwnerCard from "@/app/user/components/bookOwner";

const BookOwnerListCard: React.FC = () => {
    const [bookList, setBookList] = useState<Book[]>(mockBookCarouselList);
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 place-items-center">

        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-9 gap-10"> */}
            {bookList.map((book) => (
                <BookOwnerCard
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

export default BookOwnerListCard;
