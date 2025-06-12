import BookCard from "@/app/book/components/book";
import { Book } from "@/types/book";

export default function MyRecommendedrecommendedBookList({recommendedBookList, loading}: {recommendedBookList:Book[], loading: boolean}) {
  return (
    <div className="w-full rounded-md min-h-0 overflow-hidden">
      {loading ? (
        <p className="text-center py-4 text-gray-400">Loading your recommeded book ...</p>
      ) : recommendedBookList.length === 0 ? (
        <p className="text-center py-4 text-gray-400">Adding some book ...</p>
      ) : (
        <div className="flex space-x-6 overflow-x-auto py-4 scrollbar-hide mx-3">
          {recommendedBookList.map((book) => (
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
      )}
    </div>
  );
};

