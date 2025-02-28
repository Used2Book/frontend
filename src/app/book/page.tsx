"use client"

import useAuthStore from "@/contexts/auth-store";
import useStore from "@/contexts/useStore";
import Link from "next/link";
export default function BookPage() {
    const user = useStore(useAuthStore, (state) => state.user);

    return (
        <div className="space-y-14">
            Welcome !! Book Page {user?.email}
            <Link href="/user/home">home</Link>

        </div>
    );
}