"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/images/used2book-logo.png";
import useStore from "@/contexts/useStore";
import useAuthStore from "@/contexts/auth-store";
import Avatar from "./avatar";
import { Bell, ShoppingCart, MessageCircleMore } from "lucide-react";
import chatService from "@/services/chat";

const NavItemString = ({ href, link_string }: { href: string; link_string: string }) => (
    <li className="p-2 hover:bg-zinc-700 rounded-full text-xs md:text-sm cursor-pointer">
        <Link href={href}>{link_string}</Link>
    </li>
);

const NavItemIcon = ({ href, icon, count = 0 }: { href: string; icon: React.ReactNode; count?: number }) => (
    <li className="relative justify-center items-center p-2 hover:bg-zinc-700 rounded-full">
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

    useEffect(() => {
        if (!user) return;

        // Establish connection to chat and notification services
        chatService.connect();

        // Fetch initial unread chat count
        const fetchInitialCount = async () => {
            const chatCount = await chatService.getUnreadChatCount(user?.id.toString());
            setChatCount(chatCount);
        };
        fetchInitialCount();

        // Listen for real-time updates
        chatService.onChatNotification(({ chat }) => {
            setChatCount(chat);
        });

        // Cleanup on unmount
        return () => chatService.disconnect();
    }, [user]);

    return (
        <nav className="bg-black top-0 left-0 w-full z-10 px-4 sm:px-10 py-3 text-xs md:text-sm font-medium text-white">
            <div className="flex flex-col lg:flex-row xl:flex-row flex-wrap justify-center md:justify-between lg:justify-between items-center">
                <div className="flex flex-col lg:flex-row xl:flex-row flex-wrap justify-center md:justify-between lg:justify-between items-center space-x-2 md:space-x-10">
                    {/* Logo */}
                    <Link href="/user/profile" className="w-auto max-w-[40px] sm:max-w-[60px] md:max-w-[80px] cursor-pointer">
                        <Image src={Logo} alt="Used2Book Logo" layout="responsive" />
                    </Link>

                    {/* Navigation Links */}
                    {user ? (
                        <div>
                            <ul className="flex space-x-6 sm:space-x-10 md:space-x-12 items-center">
                                <NavItemString href="/user/home" link_string="Home" />
                                <NavItemString href="/user/webboard" link_string="Web board" />
                                <NavItemString href="/" link_string="Book hub" />
                            </ul>
                        </div>
                    ) : null}
                </div>

                {/* Right Icons */}
                <div>
                    {user ? (
                        <ul className="flex space-x-3 sm:space-x-5 items-center">
                            <NavItemIcon href="/user/cart" icon={<ShoppingCart size={20} />} />
                            <NavItemIcon href="/user/chat" icon={<MessageCircleMore size={20} />} count={chatCount} />
                            <NavItemIcon href="/notification" icon={<Bell size={20} />} />
                            <li>
                                <Link href="/user/profile" className="cursor-pointer">
                                    <div className="bg-white w-10 h-10 rounded-full overflow-hidden border border-gray-300 
                                    transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 hover:border-blue-400 hover:border-2">
                                        <Avatar user={user} />
                                    </div>
                                </Link>
                            </li>
                        </ul>
                    ) : (
                        <Link
                            href="/auth"
                            className="bg-white text-black px-3 py-2 rounded-lg hover:bg-zinc-300 transition duration-200 cursor-pointer"
                        >
                            Sign in / Sign up
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}