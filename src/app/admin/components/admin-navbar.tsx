"use client";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/images/used2book-logo.png";
import useStore from "@/contexts/useStore";
import useAuthStore from "@/contexts/auth-store";
import Avatar from "@/components/avatar";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/services/auth";
import { Bell, LogOut } from "lucide-react";
import adminService from "@/services/admin";
import { Notification } from "@/types/notification";
import { userProfile } from "@/services/user";

const AdminRequestNotiBox = ({
  user_name,
  related_id,
  created_at,
}: {
  user_name: string;
  created_at: string;
  related_id: number;
}) => (
  <li className="p-2 hover:bg-zinc-200 text-xs md:text-sm cursor-pointer font-sans text-gray-600">
    <div className="flex flex-col space-y-1">
      <p className="font-medium text-gray-600">
        Request from <span className="text-xs text-blue-500">{user_name}</span>
      </p>
      <p className="font-thin text-gray-400">{created_at}</p>
    </div>
  </li>
);

export default function AdminNavLink() {
  const user = useStore(useAuthStore, (state) => state.user);
  const [adminReqCount, setAdminReqCount] = useState(0);
  const [adminReqList, setAdminReqList] = useState<Notification[]>([]);
  const [userNames, setUserNames] = useState<Record<number, string>>({});
  const [showNotiDropdown, setShowNotiDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement | null>(null);
  const notiDropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
      if (
        notiDropdownRef.current &&
        !notiDropdownRef.current.contains(event.target as Node)
      ) {
        setShowNotiDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    adminService.connect();

    const fetchInitialData = async () => {
      const count = await adminService.getUnreadAdminRequestCount();
      const list = await adminService.getAdminRequestList();

      setAdminReqCount(count);
      setAdminReqList(list);

      const namesMap: Record<number, string> = {};

      await Promise.all(
        list.map(async (noti) => {
          const userId = noti.user_id;
          if (!namesMap[userId]) {
            try {
              const userProfileData = await userProfile(userId);
              namesMap[userId] = `${userProfileData.first_name} ${userProfileData.last_name}`;
            } catch (err) {
              console.error("Failed to fetch user profile:", err);
              namesMap[userId] = `User ${userId}`;
            }
          }
        })
      );

      setUserNames(namesMap);
    };

    fetchInitialData();

    adminService.onAdminReqCount(({ admins }) => {
      setAdminReqCount(admins);
    });

    adminService.onAdminReqList(({ lists }) => {
      setAdminReqList(lists);
    });

    return () => {
      adminService.disconnect();
    };
  }, [user]);

  const handleNotiClick = async () => {
    if (!user?.id) return;
    await adminService.updateReadAdminRequest();
    const newCount = await adminService.getUnreadAdminRequestCount();
    setAdminReqCount(newCount);
    setShowNotiDropdown(!showNotiDropdown);
  };

  return (
    <nav className="bg-black top-0 left-0 w-full z-10 px-4 sm:px-10 py-3 text-xs md:text-sm font-medium text-white">
      <div className="flex flex-col lg:flex-row xl:flex-row flex-wrap justify-center md:justify-between lg:justify-between items-center">
        <div className="flex flex-col lg:flex-row xl:flex-row flex-wrap justify-center md:justify-between lg:justify-between items-center space-x-2 md:space-x-10">
          <Link
            href="/user/profile"
            className="w-auto max-w-[40px] sm:max-w-[60px] md:max-w-[80px] cursor-pointer"
          >
            <Image src={Logo} alt="Used2Book Logo" layout="responsive" />
          </Link>
          {user ? (
            <div>
              <ul className="flex space-x-6 sm:space-x-10 md:space-x-12 items-center">
                <li className="p-2 hover:bg-zinc-500 rounded-full text-xs md:text-sm cursor-pointer font-sans text-white">
                  <Link href="/admin" passHref>
                    Home
                  </Link>
                </li>
              </ul>
            </div>
          ) : null}
        </div>
        <div>
          {user ? (
            <ul className="flex space-x-3 sm:space-x-5 items-center">
              <li className="relative" ref={notiDropdownRef}>
                <button
                  onClick={handleNotiClick}
                  className="relative p-2 hover:bg-zinc-700 rounded-full"
                >
                  <Bell size={20} color="#ffffff" />
                  {adminReqCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {adminReqCount}
                    </span>
                  )}
                </button>
                {showNotiDropdown && (
                  <div className="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-md z-50 p-1">
                    <ul className="divide-y divide-gray-100 text-sm space-y-1">
                      {adminReqList.length === 0 ? (
                        <li className="p-4 text-center text-gray-500">
                          No new notifications
                        </li>
                      ) : (
                        adminReqList.map((noti, index) => (
                          <AdminRequestNotiBox
                            key={index}
                            user_name={
                              userNames[noti.user_id] ||
                              `User ${noti.user_id}`
                            }
                            related_id={parseInt(noti.related_id)}
                            created_at={new Date(
                              noti.created_at
                            ).toLocaleString()}
                          />
                        ))
                      )}
                      {adminReqList.length !== 0 && (
                        <Link
                          href="/admin/request"
                          onClick={() => setShowNotiDropdown(false)}
                        >
                          <p className="text-blue-600 text-xs text-center hover:underline">
                            view all
                          </p>
                        </Link>
                      )}
                    </ul>
                  </div>
                )}
              </li>
              <li className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() =>
                    setShowProfileDropdown(!showProfileDropdown)
                  }
                >
                  <div className="flex space-x-2 justify-center items-center rounded-full bg-white p-2 text-black hover:bg-gray-300">
                    <div className="flex items-center justify-center bg-white w-7 h-7 rounded-full overflow-hidden border border-gray-300 focus:outline-none">
                      <Avatar user={user} />
                    </div>
                    <p className="text-xs">
                      {user.first_name} {user.last_name}
                    </p>
                  </div>
                </button>
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow-sm z-50 border-2 border-gray-200">
                    <div className="py-2">
                      <button
                        className="flex space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={async (e) => {
                          e.preventDefault();
                          await logout();
                          router.push("/auth");
                        }}
                      >
                        <LogOut size={18} />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </li>
            </ul>
          ) : (
            <Link
              href="/auth"
              className="bg-white text-black px-3 py-2 rounded-lg hover:bg-zinc-300"
            >
              Sign in / Sign up
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
