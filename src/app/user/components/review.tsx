"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import star_png from '@/assets/images/star.png';
import NoAvatar from "@/assets/images/no-avatar.png";
import ThumbsUpButton from "./thumbsup";
import { Review } from "@/types/review";

const ReviewCard: React.FC<{ reviewDetail: Review, isUserReview: boolean }> = ({ reviewDetail, isUserReview }) => {
    const [timeAgo, setTimeAgo] = useState<string>("");

    useEffect(() => {
        const calculateDaysAgo = () => {
            if (!reviewDetail || !reviewDetail.created_at) {
                setTimeAgo("Unknown date");
                return;
            }

            const reviewDate = new Date(reviewDetail.created_at);
            if (isNaN(reviewDate.getTime())) {
                setTimeAgo("Invalid date");
                return;
            }

            const currentDate = new Date();
            const timeDifference = Math.floor((currentDate.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24));

            if (timeDifference === 0) {
                setTimeAgo("Today");
            } else if (timeDifference === 1) {
                setTimeAgo("1 day ago");
            } else {
                setTimeAgo(`${timeDifference} days ago`);
            }
        };

        calculateDaysAgo();
    }, [reviewDetail]);
    return (
        <div className="flex relative h-full w-full mx-auto space-x-4 py-3 border-[2px] border-gray-100 bg-white shadow-sm rounded-md p-5">
            {/* Profile Section */}
            <div className="flex-shrink-0 flex justify-center rounded-sm">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image src={reviewDetail?.picture_profile ? reviewDetail?.picture_profile : NoAvatar} alt="Profile" width={60} height={60} />
                </div>
            </div>

            {/* Review Info Section */}
            <div className="flex-1 space-y-2 text-sm pt-1">
                <div className="flex justify-between">
                    <p className="text-base font-bold">{reviewDetail.first_name} {reviewDetail.last_name}</p>
                    <p className="text-xs text-zinc-500">{timeAgo}</p>
                </div>
                {isUserReview && reviewDetail.title &&
                    <div>
                        <span className="inline-block mb-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            {reviewDetail.title}
                        </span>
                    </div>
                }
                <div className="flex space-x-2 items-center">
                    <Image src={star_png} alt="rating" width={15} height={15} />
                    <p className="text-zinc-500">{reviewDetail.rating}.00</p>
                </div>
                <p className="line-clamp-3 py-5">
                    {reviewDetail.comment}
                </p>
                {/* <div className="flex space-x-2 items-center text-xxs">
                    <div className="flex">
                        <ThumbsUpButton />
                        <p className="pt-2">Like</p>
                    </div>
                    <p className="pt-1 text-zinc-500">({reviewDetail.likes} likes)</p>
                </div> */}
            </div>
        </div>
    );

};

export default ReviewCard;
