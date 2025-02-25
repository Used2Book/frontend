"use client"
import BookListCard from "@/app/book/components/bookList";
import RecommendBookCarouselCard from "../../components/recommendBookCarousel";
import BookHomeSearchBar from '@/app/user/components/bookHomeSearchBar'
import { useEffect, useState } from 'react';
import { allBooks } from '@/services/book';
import { Book } from '@/types/book';

export default function HomePage() {
    const [bookList, setBookList] = useState<Book[]>([]);

    useEffect(() => {
        const fetchBooks = async () => {
            const books = await allBooks();
            setBookList(books);
        };

        fetchBooks();
    }, []);
    return (
        <div>
            <RecommendBookCarouselCard />
            <BookHomeSearchBar />
            <div className="flex flex-col space-y-5 px-20 py-12 bg-slate-50">
                <div className="text-xl font-bold">Recommended for you</div>
                <BookListCard />
            </div>

        </div>
    );
}
