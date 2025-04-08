// src/components/NavLink.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/images/used2book-logo.png";
import useStore from "@/contexts/useStore";
import useAuthStore from "@/contexts/auth-store";
import Avatar from "@/components/avatar";

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

export default function AdminNavLink() {
    const user = useStore(useAuthStore, (state) => state.user);

    return (
        <nav className="bg-black top-0 left-0 w-full z-10 px-4 sm:px-10 py-3 text-xs md:text-sm font-medium text-white">
            <div className="flex flex-col lg:flex-row xl:flex-row flex-wrap justify-center md:justify-between lg:justify-between items-center">
                <div className="flex flex-col lg:flex-row xl:flex-row flex-wrap justify-center md:justify-between lg:justify-between items-center space-x-2 md:space-x-10">
                    <Link href="/user/profile" className="w-auto max-w-[40px] sm:max-w-[60px] md:max-w-[80px] cursor-pointer">
                        <Image src={Logo} alt="Used2Book Logo" layout="responsive" />
                    </Link>
                    {user ? (
                        <div>
                            <ul className="flex space-x-6 sm:space-x-10 md:space-x-12 items-center">
                                <NavItemString href="/admin" link_string="Home" />
                                {/* <NavItemString href="/user/webboard" link_string="Web board" />
                                <NavItemString href="/user/sale" link_string="Store" /> */}
                            </ul>
                        </div>
                    ) : null}
                </div>
                <div>
                    {user ? (
                        <ul className="flex space-x-3 sm:space-x-5 items-center">
                            {/* <NavItemIcon href="/user/cart" icon={<ShoppingCart size={20} />} />
                            <NavItemIcon href="/user/offer" icon={<Handshake size={20} />} />
                            <NavItemIcon href="/user/chat" icon={<MessageCircleMore size={20} />}/>
                            <NavItemIcon href="/notification" icon={<Bell size={20} />} />
                            <li>
                                <Link href="/user/profile" className="cursor-pointer">
                                </Link>
                            </li> */}
                            <li>
                                <div className="flex bg-white w-10 h-10 rounded-full overflow-hidden border border-gray-300">
                                    <Avatar user={user} />
                                </div>
                            </li>
                            <li>
                                <p className="text-white">{user.first_name} {user.last_name}</p>

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