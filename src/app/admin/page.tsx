"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { bookCount } from "@/services/book";
import { userCount } from "@/services/user";

export default function AdminPage() {
  const [countBook, setCountBook] = useState<number | null>(null);
  const [countUser, setCountUser] = useState<number | null>(null);

  useEffect(() => {
    // Fetch the book count when the component mounts
    const fetchBookCount = async () => {
      try {
        const count_book = await bookCount();
        setCountBook(count_book);
      } catch (error) {
        console.error("Failed to fetch book count:", error);
      }
    };

    const fetchUserCount = async () => {
      try {
        const count_user = await userCount();
        setCountUser(count_user);
      } catch (error) {
        console.error("Failed to fetch user count:", error);
      }
    };

    fetchBookCount();
    fetchUserCount();
  }, []);

  return (
    <div className="bg-zinc-100 min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Page</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Book Count Box */}
        <div className="bg-white rounded-lg shadow-md p-4 w-full sm:w-48 space-y-3">
          <p className="text-sm text-gray-600">Total Books</p>
          <p className="text-xl font-semibold text-gray-800">
            {countBook !== null ? countBook : "Loading..."}
          </p>
        </div>
        {/* User Count Box */}
        <div className="bg-white rounded-lg shadow-md p-4 w-full sm:w-48 space-y-3">
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-xl font-semibold text-gray-800">
            {countUser !== null ? countUser : "Loading..."}
          </p>
        </div>
      </div>
      
    </div>
  );
}