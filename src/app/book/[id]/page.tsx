"use client";
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { getBookByID, getGenresBookByID } from "@/services/book";
import BookDetailCard from "@/app/book/components/book-detail";
import { Book } from "@/types/book";
import { use } from "react";
import SaleListingList from "@/app/user/components/sale-listing-list";
import ReviewListCard from "@/app/user/components/review-list";
// import { submitReview } from "@/services/review"; // Import review service
import { FaStar } from "react-icons/fa"; // Import star icons
import { addBookReview } from "@/services/book";
import MyRecommendedBookList from "@/app/user/components/my-recommendation-list";
import Loading from "@/app/loading";
import toast from "react-hot-toast";

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const bookID = parseInt(resolvedParams.id);

    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rating, setRating] = useState<number>(0);
    const [hover, setHover] = useState<number | null>(null);
    const [reviewText, setReviewText] = useState("");
    const [refreshReviews, setRefreshReviews] = useState(false);

    useEffect(() => {
        if (!bookID) return;

        const fetchData = async () => {
            try {
                const fetchedBook = await getBookByID(bookID);
                if (!fetchedBook) {
                    setError("Book not found");
                    setLoading(false);
                    return;
                }

                const fetchedGenres = await getGenresBookByID(bookID);
                const bookWithGenres = { ...fetchedBook, genres: fetchedGenres || [] };

                setBook(bookWithGenres);
            } catch (err) {
                setError("Error fetching book or genres");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [bookID, refreshReviews]);

    const handleReviewSubmit = async () => {
        if (rating === 0) {
            toast.error("Please select a star rating before submitting.");
            return;
        }

        try {
            await addBookReview({ book_id: bookID, rating: rating, comment: reviewText });
            setIsModalOpen(false);
            setReviewText("");
            setRating(0);
            setRefreshReviews(prev => !prev);
            // alert("Review submitted successfully!");
        } catch (error) {
            console.error("Error submitting review:", error);
            // alert("Failed to submit review.");
        }
    };

    if (loading) return <Loading/>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            {book ? (
                <div className="">
                    <BookDetailCard bookDetail={book} />
                    <div className="">
                        <div className="px-20 py-2 space-y-6 mt-5">
                            <div className="flex justify-between">
                                <p className="font-semibold text-lg">Ratings & Reviews</p>
                                <button
                                    className="px-5 py-2 bg-black text-white text-sm rounded-md shadow-sm 
                                              transition-all duration-200 ease-in-out 
                                              transform hover:scale-105 active:scale-95 
                                              hover:bg-sky-500"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Write a Review
                                </button>
                            </div>
                            <ReviewListCard bookID={bookID} refreshTrigger={refreshReviews} />
                        </div>
                    </div>
                    <div className="px-20 py-2 space-y-6">
                        <p className="font-semibold text-lg">Someone who has the book</p>
                        <SaleListingList bookID={bookID} />
                    </div>
                    <div className="px-20 py-2 space-y-6 mb-20">
                        <p className="font-semibold text-lg">Recommended Similar Books</p>
                        <MyRecommendedBookList/>
                    </div>


                    {/* Review Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-6 rounded-lg w-96">
                                <h2 className="text-xl font-bold mb-4">Write a Review</h2>
                                <label className="block text-sm font-medium">Rating:</label>
                                <div className="flex mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar
                                            key={star}
                                            size={30}
                                            className="cursor-pointer transition-all"
                                            color={star <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHover(star)}
                                            onMouseLeave={() => setHover(null)}
                                        />
                                    ))}
                                </div>
                                <label className="block text-sm font-medium">Review:</label>
                                <textarea
                                    className="w-full p-2 border rounded-md mb-4"
                                    rows={4}
                                    placeholder="Write your review..."
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                />
                                <div className="flex justify-end space-x-3">
                                    <button
                                        className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                        onClick={handleReviewSubmit}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                notFound()
            )}
        </div>
    );
}
