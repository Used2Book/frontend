"use client"
import BookListCard from "@/app/book/components/bookList";
import RecommendBookCarouselCard from "../../components/recommendBookCarousel";
import BookHomeSearchBar from '@/app/user/components/bookHomeSearchBar'
import { useEffect, useState } from 'react';
import { allBooks, getRecommendedBooks } from '@/services/book';
import { Book } from '@/types/book';
import { mockBookCarouselList } from "@/assets/mockData/books";

export default function HomePage() {
    const [bookList, setBookList] = useState<Book[]>([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const books = await allBooks();
                console.log("-All books:", books); // Debug

                setBookList(books);
            } catch (error) {
                console.error("Failed to fetch books:", error);
            }
        };

        fetchBooks();
    }, []);
    return (
        <div>
            <RecommendBookCarouselCard/>

            <BookHomeSearchBar />
            <div className="flex flex-col justify-center items-center space-y-5 py-12 bg-slate-50">
                <div className="text-xl font-bold">Recommended for you</div>
                <BookListCard books={bookList} />
            </div>

        </div>
    );
}
