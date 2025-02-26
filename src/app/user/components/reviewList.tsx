"use client";
import React, { useState, useEffect } from "react";
import ReviewCard from "./review";
import { Review } from "@/types/review";
import { getBookReview } from "@/services/book";

const ReviewListCard: React.FC<{ bookID: number; refreshTrigger: boolean }> = ({ bookID, refreshTrigger }) => {
// const ReviewListCard: React.FC<{ bookID: number }> = ({ bookID }) => {
    const [reviewList, setReviewList] = useState<Review[]>([]);
    const [showAll, setShowAll] = useState<boolean>(false); // State to toggle showing all reviews

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const reviews = await getBookReview(bookID);

                // ✅ Ensure reviewList is always an array
                setReviewList(Array.isArray(reviews) ? reviews : []);
            } catch (error) {
                console.error("Error fetching reviews:", error);
                setReviewList([]); // Fallback to empty array
            }
        };

        fetchReviews();
    }, [bookID, refreshTrigger]); // Dependency to refetch when bookID changes

    const handleShowMore = () => setShowAll(true); // Function to show all reviews

    return (
        <div className="w-full bg-white">
            <div className="w-full flex flex-col space-y-1 max-h-[300px] overflow-y-auto scrollbar-hide overflow-x-hidden py-4">
                {reviewList.length === 0 ? (
                    <p className="text-center text-red-500">No reviews available</p>
                ) : (
                    reviewList
                        .slice(0, showAll ? reviewList.length : 1) // Show one or all reviews
                        .map((review) => <ReviewCard key={review.id} reviewDetail={review} />)
                )}
            </div>
            {!showAll && reviewList.length > 1 && (
                <div className="flex justify-center items-center">
                    <button
                        className="mt-4 px-4 py-2 text-zinc-500 underline rounded hover:text-blue-400 transition"
                        onClick={handleShowMore}
                    >
                        More Reviews
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReviewListCard;
