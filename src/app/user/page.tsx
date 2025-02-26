"use client"

import BookListCard from "../book/components/bookList";
import ProfileCard from "./components/profile";
import BookOrderCard from "./components/bookOrder";
import BookOrderListCard from "./components/bookOrderList";
import BookDetailCard from "../book/components/bookDetail";
import useAuthStore from "@/contexts/auth-store";
import Link from "next/link";
export default function UserPage() {
    const user = useAuthStore((state) => state.user);
    return (
        <div className="space-y-14">
            Welcome !! {user?.first_name}
            <Link href="/book">Book</Link>
            {/* <BookOrderListCard/> */}
            {/* <BookListCard /> */}
            {/* <RecommendBookCard /> */}
            {/* <ProfileCard/> */}
            {/* <BookOwnerListCard/> */}
            {/* <BookDetailCard/> */}
        </div>
    );
}