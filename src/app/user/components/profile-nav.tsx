"use client"
import React, { useState } from "react";
import Link from "next/link";
import MyBookListCard from "./myBookList";
import UserLibraryList from "@/app/user/components/userLibraryList";
import MyWishList from "@/app/user/components/myWishList";
import useAuthStore from "@/contexts/auth-store";
import MyLibraryList from "@/app/user/components/myLibraryList";
import UserBookListCard from "@/app/user/components/userBookList";
import UserWishList from "@/app/user/components/userWishList";



const ProfileNav: React.FC<{clientID: number}> = ({clientID}) => {
    const me = useAuthStore((state) => state.user)
    const [activeTab, setActiveTab] = useState<string>("Library"); // Track active tab

    const handleTabClick = (tab: string) => {
        setActiveTab(tab); // Set the clicked tab as active
    };

    return (
        <div>
            <div className="w-full flex px-16 bg-white shadow-sm rounded-lg border border-gray-200">
                <ul className="flex space-x-6 sm:space-x-10 md:space-x-12 items-center w-full">
                    <li
                        className={`p-3 text-xs md:text-sm cursor-pointer ${activeTab === "Library"
                            ? "border-b-4 border-black"
                            : "hover:bg-zinc-300"
                            }`}
                        onClick={() => handleTabClick("Library")} // Set "My Library" as active
                    >
                        <Link href="#">Library</Link>
                    </li>
                    <li
                        className={`p-3 text-xs md:text-sm cursor-pointer ${activeTab === "Post"
                            ? "border-b-4 border-black"
                            : "hover:bg-zinc-300"
                            }`}
                        onClick={() => handleTabClick("Post")} // Set "My Post" as active
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
                            {me?.id === clientID ?
                                <Link href="/user/book/add-book" className="text-white bg-black rounded-md px-10 py-2 text-sm">
                                    Add Book
                                </Link>
                                : <></>}
                        </div>
                        <div className="overflow-hidden min-h-0"> {/* ✅ Prevents extra height */}
                            {me?.id === clientID ?
                                <MyLibraryList /> :
                                <UserLibraryList clientID={clientID} />
                            }
                        </div>
                        <p className="font-semibold text-lg py-5">All on Sale</p>
                        <div className="overflow-hidden min-h-0"> {/* ✅ Prevents extra height */}
                            {me?.id === clientID ?
                                <MyBookListCard /> :
                                <UserBookListCard clientID={clientID}/>
                            }
                        </div>
                        <p className="font-semibold text-lg py-5">All WishList</p>
                        <div className="overflow-hidden min-h-0"> {/* ✅ Prevents extra height */}
                            {me?.id === clientID ?
                                <MyWishList /> :
                                <UserWishList clientID={clientID} />
                            }
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
