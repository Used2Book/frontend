"use client";
import React, { useState } from "react";
import Link from "next/link";
import MyBookListCard from "./my-book-list";
import UserLibraryList from "@/app/user/components/user-library-list";
import MyWishList from "@/app/user/components/my-wish-list";
import useAuthStore from "@/contexts/auth-store";
import MyLibraryList from "@/app/user/components/my-library-list";
import UserBookListCard from "@/app/user/components/user-book-list";
import UserWishList from "@/app/user/components/user-wish-list";

const ProfileNav: React.FC<{ clientID: number }> = ({ clientID }) => {
    const me = useAuthStore((state) => state.user);
    const [activeTab, setActiveTab] = useState<string>("Library");

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <div>
            <div className="w-full flex px-16 bg-white shadow-sm rounded-lg border border-gray-200">
                <ul className="flex space-x-6 sm:space-x-10 md:space-x-12 items-center w-full">
                    <li
                        className={`p-3 text-xs md:text-sm cursor-pointer ${
                            activeTab === "Library" ? "border-b-4 border-black" : "hover:bg-zinc-300"
                        }`}
                        onClick={() => handleTabClick("Library")}
                    >
                        <Link href="#">Library</Link>
                    </li>
                    <li
                        className={`p-3 text-xs md:text-sm cursor-pointer ${
                            activeTab === "Post" ? "border-b-4 border-black" : "hover:bg-zinc-300"
                        }`}
                        onClick={() => handleTabClick("Post")}
                    >
                        <Link href="#">Post</Link>
                    </li>
                </ul>
            </div>

            <div className="p-12 overflow-hidden min-h-0">
                {activeTab === "Library" && (
                    <div className="flex flex-col space-y-5">
                        <p className="font-semibold text-lg py-5">All My Reads</p>
                        <div className="overflow-hidden min-h-0">
                            {me?.id === clientID ? (
                                <MyLibraryList />
                            ) : (
                                <UserLibraryList clientID={clientID} />
                            )}
                        </div>
                        <p className="font-semibold text-lg py-5">All on Sale</p>
                        <div className="overflow-hidden min-h-0">
                            {me?.id === clientID ? (
                                <MyBookListCard />
                            ) : (
                                <UserBookListCard clientID={clientID} />
                            )}
                        </div>
                        <p className="font-semibold text-lg py-5">All WishList</p>
                        <div className="overflow-hidden min-h-0">
                            {me?.id === clientID ? (
                                <MyWishList />
                            ) : (
                                <UserWishList clientID={clientID} />
                            )}
                        </div>
                    </div>
                )}
                {activeTab === "Post" && (
                    <div className="flex justify-center items-center text-gray-400">
                        No Post ...
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileNav;