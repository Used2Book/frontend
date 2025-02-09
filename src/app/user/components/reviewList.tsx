"use client";
import React, { useState } from "react";
import ReviewCard from "./review";
import { mockReviews } from "@/assets/mockData/review";
import { Review } from "@/types/review";

const ReviewListCard: React.FC = () => {
    const [reviewList] = useState<Review[]>(mockReviews);
    const [showAll, setShowAll] = useState<boolean>(false); // State to toggle showing all reviews

    const handleShowMore = () => setShowAll(true); // Function to show all reviews

    return (
        <div className="w-full bg-white">
            <div className="w-full flex flex-col space-y-1 max-h-[300px] overflow-y-auto scrollbar-hide overflow-x-hidden py-4">
                {reviewList.length === 0 ? (
                    <p className="text-center text-red-500">No reviews available</p>
                ) : (
                    reviewList
                        .slice(0, showAll ? reviewList.length : 1) // Show one or all reviews based on `showAll`
                        .map((review) => <ReviewCard key={review.id} reviewDetail={review} />)
                )}
            </div>
            {!showAll && reviewList.length > 1 && ( // Show button only if more reviews are available
                <div className="flex justify-center items-center">
                    <button
                        className="mt-4 px-4 py-2 text-zinc-500 underline rounded hover:text-zinc-800 transition"
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
