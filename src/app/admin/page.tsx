"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import { bookCount } from "@/services/book";
import { userCount } from "@/services/user";

export default function AdminPage() {
  const [countBook, setCountBook] = useState(null);
  const [countUser, setCountUser] = useState(null);


  useEffect(() => {
    // Fetch the book count when the component mounts
    const fetchBookCount = async () => {
      const count_book = await bookCount();
      setCountBook(count_book);
    };

    const fetchUserCount = async () => {
        const count_user = await userCount();
        setCountUser(count_user);
      };

    fetchBookCount();
    fetchUserCount();

  }, []);

  return (
    <div className="bg-zinc-300 h-screen">
      <div>
        <h1>Admin Page</h1>
        <p>Total Books: {countBook !== null ? countBook : "Loading..."}</p>
        <p>Total Users: {countUser !== null ? countUser : "Loading..."}</p>

      </div>
      <nav>
        <Link href="/admin/book-management">Book Management</Link>
        <br />
        <Link href="/admin/user-management">User Management</Link>
      </nav>
    </div>
  );
}
