import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/services/auth";
import { User, Settings, Mail, Key, Phone, ChevronDown, ChevronUp, PictureInPicture2, CircleArrowLeft, LogOut, CircleArrowRight, CreditCard, MapPinHouse} from "lucide-react";
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
    {
        href: "/accounts/profile",
        label: "User Profile",
        icon: <User size={18} />,
        sublinks: [
            { href: "/user/account/username", label: "Change Name", icon: <User size={16} /> },
            { href: "/user/account/preferrence", label: "Update Preferences", icon: <PictureInPicture2 size={16} /> },
        ],
    },
    {
        href: "/accounts/account",
        label: "Account Management",
        icon: <Settings size={18} />,
        sublinks: [
            // { href: "/accounts/account/email", label: "Update Email Address", icon: <Mail size={16} /> },
            // { href: "/accounts/account/password", label: "Change Password", icon: <Key size={16} /> },
            { href: "/user/account/phone-number", label: "Update Phone Number", icon: <Phone size={16} /> },
            { href: "/user/account/bank-account", label: "Update Bank Account", icon: <CreditCard size={16} /> },
            // { href: "/user/account/address", label: "Update Bank Account", icon: <MapPinHouse size={16} /> },
        ],
    },
];

const SettingsSidebar: React.FC = () => {
    const pathname = usePathname();
    const [openLinks, setOpenLinks] = useState<string[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleDropdown = (href: string) => {
        if (openLinks.includes(href)) {
            setOpenLinks(openLinks.filter((link) => link !== href));
        } else {
            setOpenLinks([...openLinks, href]);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="relative h-full">
            <div className={`flex flex-col h-full ${isSidebarOpen ? "w-56" : "w-12"} bg-black shadow-md p-2 transition-all duration-300`}>
                {/* Sidebar Content */}
                <div className="flex flex-col justify-between h-full">
                    {/* Top Section */}
                    <div>
                        {/* Toggle Button */}
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={toggleSidebar}
                                className="p-1 rounded-md bg-gray-200 hover:bg-gray-300 focus:outline-none"
                            >
                                {isSidebarOpen ? <CircleArrowLeft className="absolute -right-2 z-50 bg-white rounded-full" size={22} /> : <CircleArrowRight className="absolute -right-2 z-50 bg-white rounded-full" size={22} />}
                            </button>
                        </div>

                        {/* Links */}
                        <ul className="space-y-2">
                            {links.map((link) => (
                                <li key={link.href}>
                                    {/* Main Link */}
                                    <div
                                        className={`flex items-center justify-between px-2 py-2 rounded-md text-sm font-medium cursor-pointer ${pathname.startsWith(link.href)
                                            ? "bg-white text-black"
                                            : "text-white hover:bg-zinc-800"
                                            }`}
                                        onClick={() => toggleDropdown(link.href)}
                                    >
                                        <div className="flex items-center space-x-2">
                                            {link.icon}
                                            {isSidebarOpen && <span>{link.label}</span>}
                                        </div>
                                        {link.sublinks && isSidebarOpen && (
                                            <span>
                                                {openLinks.includes(link.href) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </span>
                                        )}
                                    </div>

                                    {/* Sublinks */}
                                    {link.sublinks && openLinks.includes(link.href) && isSidebarOpen && (
                                        <ul className="pl-6 mt-1 space-y-1">
                                            {link.sublinks.map((sublink) => (
                                                <li key={sublink.href}>
                                                    <Link
                                                        href={sublink.href}
                                                        className={`flex items-center space-x-2 px-2 py-2 rounded-md text-sm font-medium ${pathname === sublink.href
                                                            ? "bg-white text-black"
                                                            : "text-white hover:bg-zinc-800"
                                                            }`}
                                                    >
                                                        {sublink.icon}
                                                        <span>{sublink.label}</span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Bottom Section */}
                    <div>
                        {/* Logout Button */}
                        <Link
                            href="/auth"
                            className="flex items-center space-x-2 px-2 py-2 w-full rounded-md text-sm font-medium text-white hover:bg-red-600"
                            onClick={async (e) => {
                                e.preventDefault(); // ✅ Prevent default link behavior
                                await logout(); // ✅ Pass router as a parameter
                            }}
                        >
                            <LogOut size={18} />
                            {isSidebarOpen && <span>Log Out</span>}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsSidebar;
