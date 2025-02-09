import React, { useState } from "react";
import Link from "next/link";
import BookOrderListCard from "./bookOrderList";


const ProfileNav: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>(""); // Track active tab

    const handleTabClick = (tab: string) => {
        setActiveTab(tab); // Set the clicked tab as active
    };

    return (
        <div>
            <div className="w-full flex px-48 bg-white">
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
            {/* Content Section */}
            <div className="p-12">
                {activeTab === "myLibrary" && (
                    <BookOrderListCard />
                )}
                {activeTab === "myPost" && (
                    <></>
                )}
            </div>
        </div>
    );
};

export default ProfileNav;
