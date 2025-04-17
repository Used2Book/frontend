"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import NoAvatar from "@/assets/images/no-avatar.png";


interface User {
  id: number;
  first_name: string;
  last_name: string;
  picture_profile: string;
}

interface UserSearchBarProps {
  users: User[];
  onUserSelect: (user: { type: "user"; id: number }) => void;
}

export default function UserSearchBar({ users, onUserSelect }: UserSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users
    .map((user) => ({
      type: "user" as const,
      id: user.id,
      label: `${user.first_name} ${user.last_name}`,
      image: user.picture_profile || null,
    }))
    .filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()));

    const onClickUser = () => {
        setSearchQuery("")
    }

  return (
      <div className="relative w-full">
        <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" size={20} />
      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-10 p-2 pr-10 border border-gray-300 rounded-full "
      />
      {searchQuery && filteredUsers.length > 0 && (
        <ul className="absolute w-full top-full mt-1 border bg-white rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          {filteredUsers.map((item) => (
            <li
              key={`${item.type}-${item.id}`}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex space-x-3 items-center"
            >
              <Link href={`/user/${item.id}`} passHref onClick={onClickUser}>
                <div className="flex space-x-3 items-center w-full">
                  {item.image && (
                    <div className="relative w-12 h-12">
                      <Image
                        alt="User profile"
                        src={item.image !== "" ? item.image : NoAvatar.src}
                        fill
                        objectFit="cover"
                        className="rounded-full border border-zinc-300 shadow-md"
                      />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <p className="text-xs font-semibold text-black truncate">
                      {item.label.length > 50 ? `${item.label.slice(0, 50)}...` : item.label}
                    </p>
                    <p className="text-xxs capitalize">{item.type}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}