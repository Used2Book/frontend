"use client";
import { useEffect, useState } from "react";
import { bookCount } from "@/services/book";
import { userCount } from "@/services/user";
import UserAdminManagement from "./components/user-management";
import BookAdminManagement from "./components/book-management";
import Loading from "./components/loading";

export default function AdminPage() {
  const [countBook, setCountBook] = useState<number | null>(null);
  const [countUser, setCountUser] = useState<number | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [count_book, count_user] = await Promise.all([
          bookCount(),
          userCount(),
        ]);
        setCountBook(count_book);
        setCountUser(count_user);
      } catch (error) {
        console.error("Failed to fetch counts:", error);
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className="bg-zinc-100 min-h-screen p-16">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex gap-6">
        {/* Left Side */}
        <div className="w-full flex flex-col space-y-4">
          <div className="w-full flex space-x-4">
            <div className="bg-white rounded-lg shadow-md p-4 w-full">
              <p className="text-sm text-gray-600">Total Books</p>
              <div className="text-xl font-semibold text-gray-800">
                {countBook !== null ? countBook : <Loading/>}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 w-full">
              <p className="text-sm text-gray-600">Total Users</p>
              <div className="text-xl font-semibold text-gray-800">
                {countUser !== null ? countUser : <Loading/>}
              </div>
            </div>
          </div>
          <BookAdminManagement/>
        </div>

        {/* Right Side */}
        <div className="flex flex-col min-h-[500px] w-full">
          <UserAdminManagement />
        </div>
      </div>
    </div>
  );
}
