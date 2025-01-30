import RecommendBookCard from "@/app/user/components/recommendBookecommendBook";
import { Book } from "@/types/book";
import BookListCard from "@/app/user/components/bookList";
import RecommendBookCarouselCard from "../components/recommendBookCarousel";
export default function HomePage() {
    // Example book data
    const book: Book = {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1546910265l/2.jpg",
        rating: 4.3,
    };

    return (
        <div>
            <RecommendBookCarouselCard/>
            <BookListCard />

        </div>
    );
}
