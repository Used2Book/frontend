"use client";
import RecommendBookCard from "@/app/user/components/recommend-book-card";
import { Book } from "@/types/book";
import { Carousel } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { getRecommendedBooks } from "@/services/book";

export default function RecommendBookCarouselCard() {
    const [recommendedBookList, setRecommendedBookList] = useState<Book[]>([]);

    useEffect(() => {
        const fetchRecommendedBooks = async () => {
            try {
                const recommendBook = await getRecommendedBooks(4);
                console.log("Recommended books:", recommendBook);
                setRecommendedBookList(recommendBook);
            } catch (error) {
                console.error("Failed to fetch recommended books:", error);
            }
        };
        fetchRecommendedBooks();
    }, []);

    return (
        <div className="w-full">
            <Carousel
                autoplay
                autoplayDelay={3000}
                loop
                className="h-[24rem] sm:h-[28rem] md:h-[32rem] lg:h-[24rem]"
                transition={{ type: "tween", duration: 0.5 }}
            >
                {recommendedBookList?.length > 0 ? (
                    recommendedBookList?.map((book) => (
                        <RecommendBookCard
                            key={book.id}
                            id={book.id}
                            title={book.title}
                            author={book.author}
                            cover_image_url={book.cover_image_url}
                            average_rating={book.average_rating}
                            description={book.description}
                            
                        />
                    ))
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                        No recommended books available
                    </div>
                )}
            </Carousel>
        </div>
    );
}