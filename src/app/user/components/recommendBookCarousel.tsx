"use client"
import RecommendBookCard from "@/app/user/components/recommendBook";
import { Book } from "@/types/book";
import { Carousel } from "@material-tailwind/react";
import { useState } from "react";
import { mockBookCarouselList } from "@/assets/mockData/books";

export default function RecommendBookCarouselCard() {
    // Example book data
    const [bookList, setBookList] = useState<Book[]>(mockBookCarouselList)
    

    return (
        <div>
            <Carousel autoplay autoplayDelay={3000} loop>
                {bookList.map((book) => (
                    <RecommendBookCard
                        key={book.id}
                        id={book.id}
                        title={book.title}
                        author={book.author}
                        cover_image_url={book.cover_image_url}
                        rating={book.rating}
                    />
                ))}
            </Carousel>
        </div>
    );
}
