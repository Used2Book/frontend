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
import { useRouter } from "next/navigation"; // <== import this at the top
import { Notification } from "@/types/notification";

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

const MySuccessPaymentNotiBox = ({ book_img_url, book_name, created_at }: { book_img_url: string; book_name: string, created_at: string }) => (
    <li className="p-2 hover:bg-zinc-200 rounded-full text-xs md:text-sm cursor-pointer font-sans text-gray-600">
        <Link href="/user/account/purchase">
            Payment success {book_name} {created_at}
        </Link>
    </li>
);

const IncomingOrderNotiBox = ({ buyer_img, buyer_name, book_name, created_at }: { buyer_img: string, buyer_name: string, book_name: string, created_at: string }) => (
    <li className="p-2 hover:bg-zinc-200 rounded-full text-xs md:text-sm cursor-pointer font-sans text-gray-600">
        <Link href="/user/account/purchase">
            Incoming order {buyer_name} {created_at}
        </Link>
    </li>
);

export default function NavLink() {
    const user = useStore(useAuthStore, (state) => state.user);
    const [chatCount, setChatCount] = useState(0);

    const [paymentCount, setPaymentCount] = useState(0);
    const [paymentList, setPaymentList] = useState<Notification[]>([]);

    const [showProfileDropdown, setshowProfileDropdown] = useState(false);

    const [showNotiDropdown, setshowNotiDropdown] = useState(false);


    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setshowProfileDropdown(false);
                setshowNotiDropdown(false)
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
            const paymentList = await paymentService.getPaymentList(user.id.toString());
            setChatCount(chatCount);
            setPaymentCount(paymentCount);
            setPaymentList(paymentList);
        };
        fetchInitialCounts();

        chatService.onChatNotification(({ chat }) => setChatCount(chat));
        paymentService.onPaymentCount(({ payments }) => setPaymentCount(payments));
        paymentService.onPaymentList(({ lists }) => setPaymentList(lists))

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
                                <NavItemString href="/user/sale/my-sale" link_string="Sale" />
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
                            {/* <NavItemIcon href="/notification" icon={<Bell size={20} color="#4b5563" />} count={paymentCount} /> */}
                            <li className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setshowNotiDropdown(!showNotiDropdown)}
                                    className="relative p-2 hover:bg-zinc-200 rounded-full"
                                >
                                    <Bell size={20} color="#4b5563" />
                                    {paymentCount > 0 && (
                                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                            {paymentCount}
                                        </span>
                                    )}
                                </button>

                                {/* Notification Dropdown */}
                                {showNotiDropdown && (
                                    <div className="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-md z-50">
                                        <ul className="divide-y divide-gray-100 text-sm">
                                            {paymentList.length === 0 ? (
                                                <li className="p-4 text-center text-gray-500">No new notifications</li>
                                            ) : (
                                                paymentList.map((noti, index) =>
                                                    user?.id === noti.seller_id ? (
                                                        <IncomingOrderNotiBox
                                                            key={index}
                                                            buyer_img="/placeholder.jpg"
                                                            buyer_name={`Buyer ${noti.buyer_id}`}
                                                            book_name={`Listing ${noti.listing_id}`}
                                                            created_at={new Date(noti.created_at).toLocaleDateString()}
                                                        />
                                                    ) : (
                                                        <MySuccessPaymentNotiBox
                                                            key={index}
                                                            book_img_url="/placeholder.jpg"
                                                            book_name={`Listing ${noti.listing_id}`}
                                                            created_at={new Date(noti.created_at).toLocaleDateString()}
                                                        />
                                                    )
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </li>

                            <li className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setshowProfileDropdown(!showProfileDropdown)}
                                    className="flex items-center justify-center bg-white w-10 h-10 rounded-full overflow-hidden border border-gray-300 ml-4 focus:outline-none"
                                >
                                    <Avatar user={user} />
                                </button>

                                {showProfileDropdown && (
                                    <div className="absolute right-0 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow-sm z-50 border-2 border-gray-200">
                                        <ul className="py-2 text-sm text-gray-700">
                                            <li>
                                                <Link href="/user/profile" className="flex space-x-2 px-4 py-2 hover:bg-gray-100" onClick={() => setshowProfileDropdown(false)}>
                                                    <User size={18} />
                                                    <p>
                                                        My Profile
                                                    </p>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/user/account" className="flex space-x-2 px-4 py-2 hover:bg-gray-100" onClick={() => setshowProfileDropdown(false)}>
                                                    <Settings size={18} />
                                                    <p>
                                                        Settings
                                                    </p>
                                                </Link>
                                            </li>
                                        </ul>
                                        <div className="py-2">
                                            <button
                                                className="flex space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={async (e) => {
                                                    e.preventDefault(); // ✅ Prevent default link behavior
                                                    await logout(); // ✅ Clear auth
                                                    router.push("/auth"); // ✅ Programmatic redirect
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
                        <Link href="/auth" className="bg-white text-black px-3 py-2 rounded-lg hover:bg-zinc-300">
                            Sign in / Sign up
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}