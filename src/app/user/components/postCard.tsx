"use client";
import { Post } from "@/types/post";
import { Comment } from "@/types/comment";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { ThumbsUp, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Avatar from "@/components/avatar";
import useAuthStore from "@/contexts/auth-store";
import { createComment, getCommentsByPostId, toggleLike, getLikeCount, getLikeStatus } from "@/services/webboard";
import { Loader2 } from "lucide-react";
import { User } from "@/types/user";
import { userProfile } from "@/services/user";
import Link from "next/link";

const PostCard: React.FC<{ postDetail: Post }> = ({ postDetail }) => {
    const user = useAuthStore((state) => state.user);
    const formattedDate = format(new Date(postDetail.created_at), "MMM d, yyyy");
    const formattedTime = format(new Date(postDetail.created_at), "hh:mm a");
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentText, setCommentText] = useState("");
    const [showComments, setShowComments] = useState(false);
    const [isCommentLoading, setIsCommentLoading] = useState(false);
    const [isLikeLoading, setIsLikeLoading] = useState(false);

    const maxGridImages = 4;
    const imageCount = postDetail.image_urls?.length || 0;
    const displayedImages = postDetail.image_urls?.slice(0, maxGridImages) || [];
    const extraImages = imageCount > maxGridImages ? imageCount - maxGridImages : 0;

    const [profile, setProfile] = useState<User | null>(null)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const clientProfile = await userProfile(postDetail.user_id);
                setProfile(clientProfile);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };
        fetchProfile();
    }, [postDetail.user_id]);

    useEffect(() => {
        const fetchData = async () => {
            setIsCommentLoading(true);
            setIsLikeLoading(true);
            try {
                const fetchedComments = await getCommentsByPostId(postDetail.id);
                setComments(fetchedComments);

                const initialLikeCount = await getLikeCount(postDetail.id);
                setLikeCount(initialLikeCount);

                const isUserLiked = await getLikeStatus(postDetail.id);
                setIsLiked(isUserLiked);
            } catch (error) {
                console.error("Failed to load initial data:", error);
            } finally {
                setIsCommentLoading(false);
                setIsLikeLoading(false);
            }
        };
        fetchData();
    }, [postDetail.id]);

    const loadComments = () => {
        setShowComments(!showComments);
    };

    const handleCommentSubmit = async () => {
        if (!user || !commentText.trim()) return;
        try {
            const newComment = await createComment(postDetail.id, commentText);
            setComments((prev) => [...prev, newComment]);
            setCommentText("");
        } catch (error) {
            console.error("Failed to submit comment:", error);
            alert("Failed to add comment.");
        }
    };

    const handleLikeToggle = async () => {
        if (!user) {
            alert("Please log in to like a post.");
            return;
        }
        setIsLikeLoading(true);
        try {
            const is_like = await toggleLike(postDetail.id);
            setIsLiked(is_like);
            const like_cnt = await getLikeCount(postDetail.id); // Use toggle to get initial state
            setLikeCount(like_cnt);
        } catch (error) {
            console.error("Failed to toggle like:", error);
            alert("Failed to like/unlike post.");
        } finally {
            setIsLikeLoading(false);
        }
    };

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
            <div className="px-4 py-6 sm:px-8 sm:pb-4">
                <div className="flex space-x-4 mb-2">
                    <Avatar user={profile} />
                    <div className="flex flex-col justify-center space-y-1">
                        <Link href={`/user/${profile?.id}`}>
                            <span className="text-sm font-semibold sm:text-base hover:underline">{profile?.first_name} {profile?.last_name}</span>
                        </Link>
                        <span className="text-xs text-gray-500 sm:text-sm">
                            {formattedDate} at {formattedTime}
                        </span>
                    </div>
                </div>
            </div>
            <div className="px-4 pb-4 sm:px-8">
                <p className="text-gray-600 text-sm sm:text-base">{postDetail.content}</p>
                {imageCount > 0 && (
                    <div className="mt-2 grid grid-cols-2 gap-1 sm:gap-2">
                        {displayedImages.map((url, i) => {
                            const isLastInThree = imageCount === 3 && i === 2;
                            return (
                                <div
                                    key={i}
                                    onClick={() => openImageModal(i)}
                                    className={`relative ${imageCount === 1 || isLastInThree ? 'col-span-2' : ''}`}
                                >
                                    <img
                                        src={url}
                                        alt="Post Image"
                                        className={`w-full object-cover rounded-lg cursor-pointer ${imageCount === 1 || isLastInThree ? 'h-48 sm:h-96' : 'h-32 sm:h-40'}`}
                                    />
                                    {i === maxGridImages - 1 && extraImages > 0 && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-sm sm:text-base rounded-lg">
                                            +{extraImages} more
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
                <div className="flex justify-between space-x-4 mt-3 p-2 rounded-md">
                    <div className="flex space-x-1 items-center">
                        <ThumbsUp size={16} className="fill-gray-400 text-gray-400" />
                        <p className="text-xs text-gray-400">{likeCount}</p>
                    </div>
                    <div className="flex space-x-1 items-center">
                        <MessageCircle size={16} className="fill-gray-400 text-gray-400" />
                        <p className="text-xs text-gray-400">{comments.length}</p>
                    </div>
                </div>
            </div>
            <div className="flex border-t border-gray-200">
                <button
                    onClick={handleLikeToggle}
                    disabled={isLikeLoading}
                    className={`flex w-full justify-center items-center space-x-2 text-center ${isLiked ? "text-blue-600" : "text-gray-500"} text-xs sm:text-sm py-2 hover:bg-gray-200`}
                >
                    {isLikeLoading ? (
                        <span className="animate-spin"><Loader2 size={14} /></span>
                    ) : (
                        <ThumbsUp
                            size={14}
                            className={`transition-all duration-300 ${isLiked ? "fill-blue-600 text-blue-600 scale-110" : "fill-none text-gray-400 hover:text-black"}`}
                        />
                    )}
                    <span className={`${isLiked ? "text-blue-600 scale-110" : "text-gray-400"}`}>Like</span>
                </button>
                <button
                    onClick={loadComments}
                    className="flex w-full justify-center items-center space-x-2 text-center text-gray-500 text-xs sm:text-sm py-2 hover:bg-gray-200"
                >
                    {isCommentLoading ? (
                        <span className="animate-spin"><Loader2 size={14} /></span>
                    ) : (
                        <MessageCircle size={14} />
                    )}
                    <span>Comment</span>
                </button>
            </div>
            {/* Comments Section */}
            {showComments && (
                <div className="px-4 pb-4 sm:px-8 border-t border-gray-200">
                    <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <div key={comment.id} className="flex space-x-2 items-start">
                                    <Avatar user={user} />
                                    <div className="flex-1">
                                        <p className="text-xs sm:text-sm font-semibold">{user?.first_name} {user?.last_name}</p>
                                        <p className="text-xs sm:text-sm text-gray-600">{comment.content}</p>
                                        <p className="text-xs text-gray-400">
                                            {format(new Date(comment.created_at), "MMM d, yyyy 'at' hh:mm a")}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs sm:text-sm text-gray-500">No comments yet.</p>
                        )}
                    </div>
                    <div className="mt-2 flex space-x-2">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-1 p-2 border rounded-md text-xs sm:text-sm"
                        />
                        <button
                            onClick={handleCommentSubmit}
                            className="px-3 py-1 bg-blue-500 text-white rounded-md text-xs sm:text-sm hover:bg-blue-600"
                        >
                            Post
                        </button>
                    </div>
                </div>
            )}
            {/* Image Modal */}
            {isImageModalOpen && postDetail.image_urls && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeImageModal}>
                    <div className="relative max-w-3xl w-full p-4 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                        <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-600" onClick={prevImage}>
                            <ChevronLeft size={24} />
                        </button>
                        <img src={postDetail.image_urls[currentImageIndex]} alt="Full Post Image" className="w-full h-auto max-h-[80vh] object-contain rounded-lg" />
                        <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-600" onClick={nextImage}>
                            <ChevronRight size={24} />
                        </button>
                        <button className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-600" onClick={closeImageModal}>
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