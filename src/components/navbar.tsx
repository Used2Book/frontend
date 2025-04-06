// src/components/NavLink.tsx
"use client";
import { useRef, useState, useEffect } from "react";

import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/images/used2book-logo-black.png";
import useStore from "@/contexts/useStore";
import useAuthStore from "@/contexts/auth-store";
import Avatar from "./avatar";
import { Bell, ShoppingCart, MessageCircleMore, Handshake, LogOut, User, Settings } from "lucide-react";
import chatService from "@/services/chat";
import paymentService from "@/services/payment";
import { logout } from "@/services/auth";

const NavItemString = ({ href, link_string }: { href: string; link_string: string }) => (
    <li className="p-2 hover:bg-zinc-200 rounded-full text-xs md:text-sm cursor-pointer font-sans text-gray-600">
        <Link href={href}>{link_string}</Link>
    </li>
);

const NavItemIcon = ({ href, icon, count = 0 }: { href: string; icon: React.ReactNode; count?: number }) => (
    <li className="relative justify-center items-center p-2 hover:bg-zinc-200 rounded-full">
        <Link href={href}>
            {icon}
            {count > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {count}
                </span>
            )}
        </Link>
    </li>
);

export default function NavLink() {
    const user = useStore(useAuthStore, (state) => state.user);
    const [chatCount, setChatCount] = useState(0);
    const [paymentCount, setPaymentCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);

    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    useEffect(() => {
        if (!user) return;

        chatService.connect();
        paymentService.connect();

        const fetchInitialCounts = async () => {
            const chatCount = await chatService.getUnreadChatCount(user.id.toString());
            const paymentCount = await paymentService.getUnreadPaymentCount(user.id.toString());
            setChatCount(chatCount);
            setPaymentCount(paymentCount);
        };
        fetchInitialCounts();

        chatService.onChatNotification(({ chat }) => setChatCount(chat));
        paymentService.onPaymentCount(({ payments }) => setPaymentCount(payments));

        return () => {
            chatService.disconnect();
            paymentService.disconnect();
        };
    }, [user]);

    return (
        <nav className="top-0 left-0 w-full z-10 px-4 sm:px-16 py-1 text-xs md:text-sm font-medium">
            <div className="flex flex-col lg:flex-row xl:flex-row flex-wrap justify-center md:justify-between lg:justify-between items-center">
                <div className="flex flex-col lg:flex-row xl:flex-row flex-wrap justify-center md:justify-between lg:justify-between items-center space-x-2 md:space-x-10 lg:space-x-20">
                    <Link href="/user/profile" className="w-auto max-w-[40px] sm:max-w-[60px] md:max-w-[80px] cursor-pointer">
                        <Image src={Logo} alt="Used2Book Logo" layout="responsive" />
                    </Link>
                    {user ? (
                        <div>
                            <ul className="flex space-x-6 sm:space-x-10 md:space-x-12 items-center">
                                <NavItemString href="/user/home" link_string="Home" />
                                <NavItemString href="/user/webboard" link_string="Web board" />
                                <NavItemString href="/user/store" link_string="Store" />
                            </ul>
                        </div>
                    ) : null}
                </div>
                <div>
                    {user ? (
                        <ul className="flex space-x-3 sm:space-x-5 items-center">
                            <NavItemIcon href="/user/cart" icon={<ShoppingCart size={20} color="#4b5563" />} />
                            <NavItemIcon href="/user/offer" icon={<Handshake size={20} color="#4b5563" />} />
                            <NavItemIcon href="/user/chat" icon={<MessageCircleMore size={20} color="#4b5563" />} count={chatCount} />
                            <NavItemIcon href="/notification" icon={<Bell size={20} color="#4b5563" />} count={paymentCount} />
                            <li className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center justify-center bg-white w-10 h-10 rounded-full overflow-hidden border border-gray-300 ml-4 focus:outline-none"
                                >
                                    <Avatar user={user} />
                                </button>

                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow-sm z-50 border-2 border-gray-200">
                                        <ul className="py-2 text-sm text-gray-700">
                                            <li>
                                                <Link href="/user/profile" className="flex space-x-2 px-4 py-2 hover:bg-gray-100" onClick={() => setShowDropdown(false)}>
                                                    <User size={18} />
                                                    <p>
                                                    My Profile
                                                    </p>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/user/setting" className="flex space-x-2 px-4 py-2 hover:bg-gray-100" onClick={() => setShowDropdown(false)}>
                                                    <Settings size={18}/>
                                                    <p>
                                                    Settings
                                                    </p>
                                                </Link>
                                            </li>
                                        </ul>
                                        <div className="py-2">
                                            {/* <button
                                                onClick={() => {
                                                    useAuthStore.getState().logout();
                                                    setShowDropdown(false);
                                                }}
                                                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Logout
                                            </button> */}

                                            <Link
                                                href="/auth"
                                                className="flex space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={async (e) => {
                                                    e.preventDefault(); // ✅ Prevent default link behavior
                                                    await logout(); // ✅ Pass router as a parameter
                                                }}
                                            >
                                                <LogOut size={18} />
                                                <span className="">Log Out</span>
                                            </Link>

                                        </div>
                                    </div>
                                )}
                            </li>
                        </ul>
                    ) : (
                        <Link href="/auth" className="bg-white text-black px-3 py-2 rounded-lg hover:bg-zinc-300">
                            Sign in / Sign up
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}