"use client"

import BookListCard from "../book/components/bookList";
import ProfileCard from "./components/profile";
import BookOrderCard from "./components/bookOrder";
import BookOrderListCard from "./components/bookOrderList";
import BookOwnerListCard from "./components/bookOwnerList";
import BookDetailCard from "../book/components/bookDetail";
import useAuthStore from "@/contexts/auth-store";
import useStore from "@/contexts/useStore";
import Link from "next/link";
import NavLink from "@/components/navbar";
export default function BookPage() {
    const user = useStore(useAuthStore, (state) => state.user);

    return (
        <div className="space-y-14">
            Welcome !! Book Page {user?.email}
            <Link href="/user/home">home</Link>
            {/* <BookOrderListCard/> */}
            {/* <BookListCard /> */}
            {/* <RecommendBookCard /> */}
            {/* <ProfileCard/> */}
            {/* <BookOwnerListCard/> */}
            {/* <BookDetailCard/> */}
        </div>
    );
}