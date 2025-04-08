"use client";
import Menu_Icon from "@/assets/images/menu.png";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef  } from "react";


const MenuDropdown = () => {

    const [isOpen, setIsOpen] = useState(false);

    const handleCloseDropdown = () => {
        setIsOpen(false)
    }
    
    const MenuItem = ({ href, link_string }: { href: string; link_string: string }) => (
        <li className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
            <Link href={href} onClick={handleCloseDropdown}>{link_string}</Link>
        </li> 
    );

    return (
        <div className="relative inline-block">
            {/* ✅ Button that toggles the dropdown */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="justify-center items-center p-2 hover:bg-zinc-700 rounded-full"
                type="button"
            >
                <Image src={Menu_Icon} alt="menu" width={20} height={20} />
            </button>

            {/* ✅ Dropdown menu (visible when `isOpen` is `true`) */}
            {isOpen && (
                <div className="absolute right-0 mt-2 z-10 bg-white rounded-lg shadow-md w-44">
                    <ul className="py-2 text-sm text-gray-700 divide-y divide-gray-200">
                        <MenuItem href="/user/account/profile" link_string="Setting"/>
                        <MenuItem href="/auth" link_string="Sign out"/>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MenuDropdown;
