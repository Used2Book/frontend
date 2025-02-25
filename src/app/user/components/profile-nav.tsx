"use client"
import React, { useState } from "react";
import Link from "next/link";
import BookOrderListCard from "./bookOrderList";
import BookOwnerListCard from "./bookOwnerList";
import UserLibraryList from "@/app/user/components/userLibraryList";
import MyWishList from "@/app/user/components/myWishList";
const ProfileNav: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>(""); // Track active tab

    const handleTabClick = (tab: string) => {
        setActiveTab(tab); // Set the clicked tab as active
    };

    return (
        <div>
            <div className="w-full flex px-16 bg-white shadow-sm rounded-lg border border-gray-200">
                <ul className="flex space-x-6 sm:space-x-10 md:space-x-12 items-center w-full">
                    <li
                        className={`p-3 text-xs md:text-sm cursor-pointer ${activeTab === "myPost"
                            ? "border-b-4 border-black"
                            : "hover:bg-zinc-300"
                            }`}
                        onClick={() => handleTabClick("myPost")} // Set "My Post" as active
                    >
                        <Link href="#">My Post</Link>
                    </li>
                    <li
                        className={`p-3 text-xs md:text-sm cursor-pointer ${activeTab === "myLibrary"
                            ? "border-b-4 border-black"
                            : "hover:bg-zinc-300"
                            }`}
                        onClick={() => handleTabClick("myLibrary")} // Set "My Library" as active
                    >
                        <Link href="#">My Library</Link>
                    </li>
                </ul>
            </div>

            <div className="p-12 overflow-hidden min-h-0">
                {activeTab === "myLibrary" && (
                    <div className="flex flex-col space-y-5">
                        <div className="flex justify-between py-5">
                            <p className="font-semibold text-lg">All My Reads</p>
                            <Link href="/user/book/add-book" className="text-white bg-black rounded-md px-10 py-2 text-sm">
                                Add Book
                            </Link>
                        </div>
                        <div className="overflow-hidden min-h-0"> {/* ✅ Prevents extra height */}
                            <UserLibraryList />
                        </div>
                        <p className="font-semibold text-lg py-5">All on Sale</p>
                        <div className="overflow-hidden min-h-0"> {/* ✅ Prevents extra height */}
                            <BookOwnerListCard />
                        </div>
                        <p className="font-semibold text-lg py-5">All WishList</p>
                        <div className="overflow-hidden min-h-0"> {/* ✅ Prevents extra height */}
                            <MyWishList/>
                        </div>
                    </div>
                )}
                {activeTab === "myPost" && (
                    <div className="flex justify-center items-center text-gray-400">
                        No Post ...
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileNav;
