"use client";
import { Post } from "@/types/post";
import { format } from "date-fns";
import { UserInfo } from "@/assets/mockData/user";
import { useState } from "react";
import { ThumbsUp, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Avatar from "@/components/avatar";

const PostCard: React.FC<{ postDetail: Post }> = ({ postDetail }) => {
    const formattedDate = format(new Date(postDetail.created_at), "MMM d, yyyy");
    const formattedTime = format(new Date(postDetail.created_at), "hh:mm a");
    const [isLiked, setIsLiked] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const maxGridImages = 4; // Max images in grid
    const imageCount = postDetail.image_urls?.length || 0;
    const displayedImages = postDetail.image_urls?.slice(0, maxGridImages) || [];
    const extraImages = imageCount > maxGridImages ? imageCount - maxGridImages : 0;

    const openImageModal = (index: number) => {
        setCurrentImageIndex(index);
        setIsImageModalOpen(true);
    };

    const closeImageModal = () => {
        setIsImageModalOpen(false);
        setCurrentImageIndex(0);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : imageCount - 1));
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev < imageCount - 1 ? prev + 1 : 0));
    };

    return (
        <div className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow duration-300 flex flex-col w-full max-w-2xl mx-auto">
            {/* Header */}
            <div className="px-4 py-6 sm:px-8 sm:pb-4">
                <div className="flex space-x-4 mb-2">
                    <Avatar user={UserInfo} />
                    <div className="flex flex-col justify-center space-y-1">
                        <span className="text-sm font-semibold sm:text-base">Name Surname</span>
                        <span className="text-xs text-gray-500 sm:text-sm">
                            {formattedDate} at {formattedTime}
                        </span>
                    </div>
                </div>
            </div>
            {/* Content */}
            <div className="px-4 pb-4 sm:px-8">
                <p className="text-gray-600 text-sm sm:text-base line-clamp-3">
                    {postDetail.content}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-1 sm:gap-2">
                    {displayedImages.map((url, i) => {
                        // Condition: If exactly 3 images, and we’re on the last image (index 2), span 2 columns
                        const isLastInThree = (imageCount === 3 && i === 2);

                        return (
                            <div
                                key={i}
                                onClick={() => openImageModal(i)}
                                className={`relative ${imageCount === 1 || isLastInThree ? 'col-span-2' : ''
                                    }`}
                            >
                                <img
                                    src={url}
                                    alt="Post Image"
                                    className={`w-full object-cover rounded-lg cursor-pointer ${imageCount === 1 || isLastInThree ? 'h-48 sm:h-96' : 'h-32 sm:h-40'
                                        }`}
                                />
                                {/* If this is the last displayed image (4th slot) AND there are more images hidden */}
                                {i === maxGridImages - 1 && extraImages > 0 && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-sm sm:text-base rounded-lg">
                                        +{extraImages} more
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Buttons */}
            <div className="flex border-t border-gray-200">
                <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`flex w-full justify-center items-center space-x-2 text-center ${isLiked ? "text-blue-600" : "text-gray-500"} text-xs sm:text-sm py-2 hover:bg-gray-200 transition-colors duration-200 rounded-br-lg`}
                >
                    <ThumbsUp
                        size={14}
                        className={`transition-all duration-300 ${isLiked
                            ? "fill-blue-600 text-blue-600 scale-110"
                            : "fill-none text-gray-400 hover:text-black"
                            }`}
                    />
                    <span>Like</span>
                </button>
                <button className="flex w-full justify-center items-center space-x-2 text-center text-gray-500 text-xs sm:text-sm py-2 hover:bg-gray-200 transition-colors duration-200 rounded-bl-lg">
                    <MessageCircle size={14} />
                    <span>Comment</span>
                </button>
            </div>
            {/* Image Modal with Manual Slider */}
            {isImageModalOpen && postDetail.image_urls && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                    onClick={closeImageModal}
                >
                    <div
                        className="relative max-w-3xl w-full p-4 flex items-center justify-between"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-600"
                            onClick={prevImage}
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <img
                            src={postDetail.image_urls[currentImageIndex]}
                            alt="Full Post Image"
                            className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                        />
                        <button
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-600"
                            onClick={nextImage}
                        >
                            <ChevronRight size={24} />
                        </button>
                        <button
                            className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-600"
                            onClick={closeImageModal}
                        >
                            ✕
                        </button>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded">
                            {currentImageIndex + 1} / {imageCount}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostCard;