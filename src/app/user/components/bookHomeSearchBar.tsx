"use client";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const BookHomeSearchBar: React.FC = () => {
    const [search, setSearch] = useState("");
    const [author, setAuthor] = useState("");
    const [genre, setGenre] = useState("");

    return (
        <nav className="bg-black p-4 flex justify-center">
            <div className="flex w-full max-w-5xl items-center space-x-4">
                
                {/* 🔍 Search Input */}
                <div className="relative flex-grow">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Filter Search .."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-1/2 pl-10 pr-4 py-2 rounded-full bg-white text-black shadow-md focus:outline-none"
                    />
                </div>

                {/* ⬇️ Author Dropdown */}
                <select
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="bg-white px-4 py-2 rounded-full shadow-md focus:outline-none"
                >
                    <option value="" hidden>author</option>
                    <option value="author1">Author 1</option>
                    <option value="author2">Author 2</option>
                </select>

                {/* ⬇️ Genre Dropdown */}
                <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="bg-white px-4 py-2 rounded-full shadow-md focus:outline-none"
                >
                    <option value="" hidden>genres</option>
                    <option value="genre1">Genre 1</option>
                    <option value="genre2">Genre 2</option>
                </select>
            </div>
        </nav>
    );
};

export default BookHomeSearchBar;
