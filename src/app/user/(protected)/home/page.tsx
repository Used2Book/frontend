// src/app/page.tsx
"use client";
import BookListCard from "@/app/book/components/book-list";
import RecommendBookCarouselCard from "@/app/user/components/recommend-book-carousel";
import BookHomeSearchBar from "@/app/user/components/book-home-search-bar";
import MyRecommendedBookList from "@/app/user/components/my-recommendation-list";
import { useEffect, useState } from "react";
import { allBooks, getAllGenres, getAllBookGenres } from "@/services/book";
import { Book } from "@/types/book";
import { ChevronDown } from "lucide-react";

export default function HomePage() {
  const [bookList, setBookList] = useState<Book[]>([]);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [bookGenres, setBookGenres] = useState<{ book_id: number; genre_id: number }[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [books, fetchedGenres, bookGenreMappings] = await Promise.all([
          allBooks(),
          getAllGenres(),
          getAllBookGenres(),
        ]);
        console.log("-All books:", books);
        console.log("-All genres:", fetchedGenres);
        console.log("-Book genres:", bookGenreMappings);
        setBookList(books);
        setGenres(fetchedGenres);
        setBookGenres(bookGenreMappings);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter books by selected genre (multi-genre support)
  const filteredBooks = selectedGenreId
    ? bookList.filter((book) =>
      bookGenres.some(
        (bg) => bg.book_id === book.id && bg.genre_id === selectedGenreId
      )
    )
    : bookList;

  console.log("Filtered books:", filteredBooks);

  return (
    <div className="mb-10">
      <RecommendBookCarouselCard />
      <div className="mx-16 mt-4">
        <div className="flex flex-col space-y-5 py-12">
          <div className="text-xl font-bold">Recommended for you</div>
          <MyRecommendedBookList />
        </div>

        <div className="flex justify-between items-center space-y-5 py-12">
          <div className="text-xl font-bold">All Books</div>
          {/* Genre Filter Dropdown */}
          <div className="w-full max-w-md relative">
            <select
              value={selectedGenreId ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedGenreId(value ? Number(value) : null);
              }}
              className="appearance-none w-full py-2 px-6 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown className="h-3 w-3 text-gray-600" />
            </div>
          </div>
        </div>
        <BookListCard books={filteredBooks} />
      </div>
    </div>
  );
}