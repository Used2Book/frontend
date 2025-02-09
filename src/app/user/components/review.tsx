"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import star_png from '@/assets/images/star.png';
import Cat_Profile from "@/assets/images/cat-profile.jpg";
import ThumbsUpButton from "./thumbsup";
import { Review } from "@/types/review";

const ReviewCard: React.FC<{ reviewDetail: Review }> = ({ reviewDetail }) => {
    const [timeAgo, setTimeAgo] = useState<string>("");

    useEffect(() => {
        const calculateDaysAgo = () => {
            if (!reviewDetail || !reviewDetail.datePosted) {
                setTimeAgo("Unknown date");
                return;
            }

            const reviewDate = new Date(reviewDetail.datePosted);
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
        <div className="flex relative h-full w-full mx-auto space-x-4 py-3 border-b-[1px] border-zinc-200">
            {/* Profile Section */}
            <div className="flex-shrink-0 flex justify-center rounded-sm">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image src={Cat_Profile} alt="Profile" width={60} height={60} />
                </div>
            </div>

            {/* Review Info Section */}
            <div className="flex-1 space-y-2 text-sm pt-1">
                <div className="flex justify-between">
                    <p className="text-base font-bold">{reviewDetail.username}</p>
                    <p className="text-xs text-zinc-500">{timeAgo}</p>
                </div>
                <div className="flex space-x-2 items-center">
                    <Image src={star_png} alt="rating" width={15} height={15} />
                    <p>{reviewDetail.rating}</p>
                </div>
                <p className="line-clamp-3">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
                <div className="flex space-x-2 items-center text-xxs">
                    <div className="flex">
                        <ThumbsUpButton />
                        <p className="pt-2">Like</p>
                    </div>
                    <p className="pt-1 text-zinc-500">({reviewDetail.likes} likes)</p>
                </div>
            </div>
        </div>
    );

};

export default ReviewCard;
