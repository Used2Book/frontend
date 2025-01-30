import React, { useState } from "react";
import Link from "next/link";

const ProfileNav: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>(""); // Track active tab

    const handleTabClick = (tab: string) => {
        setActiveTab(tab); // Set the clicked tab as active
    };

    return (
        <div className="w-full flex mx-48">
            <ul className="flex space-x-6 sm:space-x-10 md:space-x-12 items-center">
                <li
                    className={`p-5 text-xs md:text-sm cursor-pointer ${
                        activeTab === "myPost"
                            ? "border-b-4 border-black"
                            : "hover:bg-zinc-300"
                    }`}
                    onClick={() => handleTabClick("myPost")} // Set "My Post" as active
                >
                    <Link href="#">My Post</Link>
                </li>
                <li
                    className={`p-5 text-xs md:text-sm cursor-pointer ${
                        activeTab === "myLibrary"
                            ? "border-b-4 border-black"
                            : "hover:bg-zinc-300"
                    }`}
                    onClick={() => handleTabClick("myLibrary")} // Set "My Library" as active
                >
                    <Link href="#">My Library</Link>
                </li>

            </ul>
        </div>
    );
};

export default ProfileNav;
