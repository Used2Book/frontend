import { Book } from "@/types/book";
import BookListCard from "@/app/book/components/bookList";
import RecommendBookCarouselCard from "../../components/recommendBookCarousel";
export default function HomePage() {

    return (
        <div>
            <RecommendBookCarouselCard/>
            <BookListCard />

        </div>
    );
}
