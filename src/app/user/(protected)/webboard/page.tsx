"use client";
import PostCard from "@/app/user/components/postCard";
import { Post } from "@/types/post";
import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Avatar from "@/components/avatar";
import useAuthStore from "@/contexts/auth-store";
import { ImagePlus, Loader2 } from "lucide-react"; // Added Loader2 for spinner
import { uploadPostImages, createPost } from "@/services/webboard";
import { getAllPosts } from "@/services/webboard";

export default function WebBoardPage() {
    const user = useAuthStore((state) => state.user);
    const [postList, setPostList] = useState<Post[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [postText, setPostText] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false); // New loading state

    useEffect(() => {
        const fetchPostListStatus = async () => {
            const posts = await getAllPosts();
            setPostList(posts);
        };
        fetchPostListStatus();
    }, []);

    const handlePostSubmit = async () => {
        if (!user) {
            alert("Please log in to submit a post.");
            return;
        }

        setIsLoading(true); // Show loading popup
        try {
            let imageUrls: string[] = [];
            if (images.length > 0) {
                imageUrls = await uploadPostImages(images);
            }
            const newPost = await createPost(postText, imageUrls);
            setPostList((prev) => [newPost, ...prev]);
            setPostText("");
            setImages([]);
            setPreviewImages([]);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error submitting post:", error);
            alert("Failed to submit post.");
        } finally {
            setIsLoading(false); // Hide loading popup
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const selectedFiles = Array.from(e.target.files);
        setImages((prevImages) => [...prevImages, ...selectedFiles]);
        const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
        setPreviewImages((prevPreviews) => [...prevPreviews, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
        setPreviewImages((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    };

    return (
        <div className="min-h-screen">
            {postList ? (
                <>
                    <div className="p-4 sm:p-8 md:p-16 lg:p-24 w-full">
                        <p className="text-xl sm:text-2xl font-bold mb-4">WebBoardPage</p>
                        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-3 w-full">
                            <div className="flex-1 flex flex-col space-y-5">
                                {postList.map((post) => (
                                    <PostCard key={post.id} postDetail={post} />
                                ))}
                            </div>
                            <div className="flex flex-col space-y-5 w-full md:w-1/3">
                                <button
                                    className="w-full py-3 bg-black text-white text-sm sm:text-base rounded-lg hover:bg-gray-800"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    + New Post
                                </button>
                                {postList.map((post) => (
                                    <PostCard key={post.id} postDetail={post} />
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Post Creation Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
                            <div className="bg-white p-4 sm:p-8 rounded-lg w-full max-w-lg sm:max-w-xl md:max-w-2xl">
                                <div className="pt-4 pb-4 sm:pt-8">
                                    <div className="flex space-x-4 mb-2">
                                        <Avatar user={user} />
                                        <div className="flex flex-col justify-center space-y-1">
                                            <span className="text-sm sm:text-base font-semibold">
                                                {user?.first_name} {user?.last_name}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <textarea
                                    className="w-full p-2 border rounded-md mb-4 text-sm sm:text-base"
                                    rows={4}
                                    placeholder="Write down something..."
                                    value={postText}
                                    onChange={(e) => setPostText(e.target.value)}
                                />
                                <div>
                                    <div className="flex overflow-x-auto gap-2 mt-2 pb-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                        {previewImages.map((src, index) => (
                                            <div
                                                key={index}
                                                className="flex-shrink-0 w-20 h-24 sm:w-24 sm:h-32 border rounded-lg overflow-hidden snap-start"
                                            >
                                                <img src={src} alt="Post Image" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1 hover:bg-red-600"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                        <label className="flex-shrink-0 w-20 h-24 sm:w-24 sm:h-32 border border-gray-300 rounded-lg flex justify-center items-center cursor-pointer bg-gray-100 hover:bg-gray-200">
                                            <ImagePlus size={20} color="gray" />
                                            <input
                                                type="file"
                                                multiple
                                                className="hidden"
                                                onChange={handleImageChange}
                                                accept="image/*"
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3 mt-4">
                                    <button
                                        className="px-3 py-2 sm:px-4 bg-gray-300 rounded-md text-sm sm:text-base hover:bg-gray-400"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="px-3 py-2 sm:px-4 bg-blue-500 text-white rounded-md text-sm sm:text-base hover:bg-blue-600"
                                        onClick={handlePostSubmit}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Loading Popup */}
                    {isLoading && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg flex flex-col items-center space-y-4">
                                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                <p className="text-sm text-gray-600">Saving your post...</p>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                notFound()
            )}
        </div>
    );
}