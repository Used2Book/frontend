import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, CreditCard, ShoppingBag } from "lucide-react";
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

    { href: "/user/account/profile", label: "Profile Setting", icon: <User size={16} /> },
    { href: "/user/account/purchase", label: "My Purchase", icon: <ShoppingBag size={16} />},


    // { href: "/user/account/username", label: "Change Name", icon: <User size={16} /> },
    // { href: "/user/account/preferrence", label: "Update Preferences", icon: <PictureInPicture2 size={16} /> },
    // { href: "/user/account/phone-number", label: "Update Phone Number", icon: <Phone size={16} /> },
    { href: "/user/account/bank-account", label: "Update Bank Account", icon: <CreditCard size={16} /> },


];

const SettingsSidebar: React.FC = () => {
    const pathname = usePathname();

    return (
        <div className="relative h-full">
            <div className="flex flex-col h-full w-64 shadow-md px-8 py-5 transition-all duration-300">
                <div className="font-semibold text-xl mb-5">
                    <p>My Account</p>
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

export default SettingsSidebar;
