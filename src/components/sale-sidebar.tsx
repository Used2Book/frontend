import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/services/auth";
import { User, Settings, Mail, Key, Phone, ChevronDown, ChevronUp, PictureInPicture2, CircleArrowLeft, LogOut, CircleArrowRight, CreditCard, MapPinHouse, ShoppingBag, BookUp, BookmarkCheck, BookHeart } from "lucide-react";
type Sublink = {
    href: string;
    label: string;
    icon: React.ReactNode;
};

type LinkItem = {
    href: string;
    label: string;
    icon: React.ReactNode;
    sublinks?: Sublink[];
};

const links: LinkItem[] = [

    { href: "/user/sale/my-sale", label: "My Sales", icon: <BookUp  size={16}/> },
    { href: "/user/sale/my-order", label: "My Orders", icon: <BookmarkCheck size={16} />},

];

const SaleSettingsSidebar: React.FC = () => {
    const pathname = usePathname();

    return (
        <div className="relative h-full">
            <div className="flex flex-col h-full w-64 shadow-md px-8 py-5 transition-all duration-300">
                <div className="font-semibold text-xl mb-5">
                    <p>Sale Management</p>
                </div>
                <div className="flex flex-col justify-between h-full">
                    <div>
                        <ul className="space-y-2">
                            {links.map((link) => (
                                <li key={link.href}>

                                    <Link
                                        href={link.href}
                                        className={`flex items-center space-x-2 px-2 py-2 rounded-md text-sm font-medium ${pathname === link.href
                                            ? "bg-gray-200"
                                            : "bg-white hover:bg-gray-200"
                                            }`}
                                    >
                                        {link.icon}
                                        <span>{link.label}</span>
                                    </Link>
                                </li>))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default SaleSettingsSidebar;
