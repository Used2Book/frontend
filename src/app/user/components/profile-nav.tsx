"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import MyBookListCard from "./my-book-list";
import UserLibraryList from "@/app/user/components/user-library-list";
import MyWishList from "@/app/user/components/my-wish-list";
import useAuthStore from "@/contexts/auth-store";
import MyLibraryList from "@/app/user/components/my-library-list";
import UserBookListCard from "@/app/user/components/user-book-list";
import UserWishList from "@/app/user/components/user-wish-list";
import PostCard from "@/app/user/components/post-card";
import { Post } from "@/types/post";
import { getPostsByUserID } from "@/services/webboard";
import { allBooks } from "@/services/book";
import { getAllGenres } from "@/services/book";

const ProfileNav: React.FC<{ clientID: number }> = ({ clientID }) => {
    const me = useAuthStore((state) => state.user);
    const [activeTab, setActiveTab] = useState<string>("Library");
    const [posts, setPosts] = useState<Post[]>([]);
    const [books, setBooks] = useState<{ id: number; title: string; cover_image_url: string }[]>([]);
    const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [fetchedPosts, fetchedBooks, fetchedGenres] = await Promise.all([
                    getPostsByUserID(clientID),
                    allBooks(),
                    getAllGenres(),
                ]);
                setPosts(fetchedPosts);
                setBooks(fetchedBooks);
                setGenres(fetchedGenres);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };
        fetchData();
    }, [clientID]);

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <div>
            <div className="w-full flex px-16 bg-white shadow-sm rounded-lg border border-gray-200">
                <ul className="flex space-x-6 sm:space-x-10 md:space-x-12 items-center w-full">
                    <li
                        className={`p-3 text-xs md:text-sm cursor-pointer ${activeTab === "Library" ? "border-b-4 border-black text-black" : "hover:bg-zinc-300 text-gray-400"}`}
                        onClick={() => handleTabClick("Library")}
                    >
                        <Link href="#">Library</Link>
                    </li>
                    <li
                        className={`p-3 text-xs md:text-sm cursor-pointer ${activeTab === "Wishlist" ? "border-b-4 border-black text-black" : "hover:bg-zinc-300 text-gray-400"}`}
                        onClick={() => handleTabClick("Wishlist")}
                    >
                        <Link href="#">Wishlist</Link>
                    </li>
                    <li
                        className={`p-3 text-xs md:text-sm cursor-pointer ${activeTab === "Store" ? "border-b-4 border-black text-black" : "hover:bg-zinc-300 text-gray-400"}`}
                        onClick={() => handleTabClick("Store")}
                    >
                        <Link href="#">Store</Link>
                    </li>
                    <li
                        className={`p-3 text-xs md:text-sm cursor-pointer ${activeTab === "Post" ? "border-b-4 border-black text-black" : "hover:bg-zinc-300 text-gray-400"}`}
                        onClick={() => handleTabClick("Post")}
                    >
                        <Link href="#">Post</Link>
                    </li>
                </ul>
            </div>

            <div className="p-12 overflow-hidden min-h-0">
                {activeTab === "Library" && (
                    <div className="flex flex-col space-y-5">
                        <div className="flex justify-between py-5">
                            <p className="font-semibold text-lg">All My Reads</p>
                            {me?.id === clientID ? (
                                <Link href="/user/book/add-library-book" className="">
                                    <p className="text-center text-xs font-bold rounded-md shadow-md w-full px-20 py-2 border-[1.5px] transition-all duration-200 ease-in-out transform bg-black text-white hover:bg-zinc-700 hover:scale-105 active:scale-90">
                                        Add to My Reads
                                    </p>
                                </Link>
                            ) : (
                                <></>
                            )}
                        </div>
                        <div className="overflow-hidden min-h-0">
                            {me?.id === clientID ? <MyLibraryList /> : <UserLibraryList clientID={clientID} />}
                        </div>
                    </div>
                )}
                {activeTab === "Wishlist" && (
                    <div className="flex flex-col space-y-5">
                        <p className="font-semibold text-lg py-5">All WishList</p>
                        <div className="overflow-hidden min-h-0">
                            {me?.id === clientID ? <MyWishList /> : <UserWishList clientID={clientID} />}
                        </div>
                    </div>
                )}
                {activeTab === "Store" && (
                    <div className="flex flex-col space-y-5">
                        <p className="font-semibold text-lg py-5">All on Sale</p>
                        <div className="overflow-hidden min-h-0">
                            {me?.id === clientID ? (
                                <MyBookListCard />
                            ) : (
                                <UserBookListCard clientID={clientID} />
                            )}
                        </div>
                    </div>
                )}
                {activeTab === "Post" && (
                    <div className="flex flex-col space-y-5">
                        {posts?.length > 0 ? (
                            posts.map((post) => (
                                <PostCard key={post.id} postDetail={post} books={books} genres={genres} />
                            ))
                        ) : (
                            <div className="flex justify-center items-center text-gray-400">No Post ...</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileNav;