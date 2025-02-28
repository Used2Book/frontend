"use client"

import useAuthStore from "@/contexts/auth-store";
import Link from "next/link";
export default function UserPage() {
    const user = useAuthStore((state) => state.user);
    return (
        <div className="space-y-14">
            Welcome !! {user?.first_name}
            <Link href="/book">Book</Link>

        </div>
    );
}