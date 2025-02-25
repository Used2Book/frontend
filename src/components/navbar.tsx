import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/images/used2book-logo.png";
import Bell_Noti from "@/assets/images/notification.png";
import Chat_Icon from "@/assets/images/nav-chat.png";
import Heart_Icon from "@/assets/images/heart.png";
import Profile_Image from "@/assets/images/profile.jpg";
import Menu_Icon from "@/assets/images/menu.png";
import Cat_Profile from "@/assets/images/cat-profile.jpg";
import useStore from "@/contexts/useStore";
import useAuthStore from "@/contexts/auth-store";
import { logout } from "@/services/auth";
import MenuDropdown from "./menu-dropdown";
import Avatar from "./avatar";
const NavItemString = ({ href, link_string }: { href: string; link_string: string }) => (
    <li className="p-2 hover:bg-zinc-700 rounded-full text-xs md:text-sm cursor-pointer">
        <Link href={href}>{link_string}</Link>
    </li>
);

const NavItemIcon = ({ href, src, alt }: { href: string; src: string; alt: string }) => (
    <li className="justify-center items-center p-2 hover:bg-zinc-700 rounded-full">
        <Link href={href}>
            <Image src={src} alt={alt} width={20} height={20} />
        </Link>
    </li>
);

export default function NavLink() {
    const user = useStore(useAuthStore, (state) => state.user);

    return (
        <nav className="bg-black top-0 left-0 w-full z-10 px-4 sm:px-10 py-3 text-xs md:text-sm font-medium text-white">
            <div className="flex flex-col lg:flex-row xl:flex-row flex-wrap justify-center md:justify-between lg:justify-between items-center">
                <div className="flex flex-col lg:flex-row xl:flex-row flex-wrap justify-center md:justify-between lg:justify-between items-center space-x-2 md:space-x-10">

                    {/* Logo */}
                    <Link href="/user/profile" className="w-auto max-w-[40px] sm:max-w-[60px] md:max-w-[80px] cursor-pointer">
                        <Image src={Logo} alt="Used2Book Logo" layout="responsive" />
                    </Link>

                    {/* Navigation Links */}
                    {user ?
                        (<div>
                            <ul className="flex space-x-6 sm:space-x-10 md:space-x-12 items-center">
                                <NavItemString href="/user/home" link_string="Home" />
                                <NavItemString href="/" link_string="Web board" />
                                <NavItemString href="/" link_string="Book hub" />
                                {/* <NavItemString href="/" link_string="Library" /> */}
                            </ul>
                        </div>) : <></>
                    }
                </div>

                {/* Right Icons */}
                <div>
                    {user ?
                        (<ul className="flex space-x-3 sm:space-x-5 items-center">
                            <NavItemIcon href="/wishlist" alt="wishlist" src={Heart_Icon.src} />
                            <NavItemIcon href="/chat" alt="chat" src={Chat_Icon.src} />
                            <NavItemIcon href="/notification" alt="notification" src={Bell_Noti.src} />
                            <li>
                                <Link href="/user/profile" className="cursor-pointer">
                                    <div className="bg-green-500 w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-gray-300">
                                        <Avatar user={user} />
                                    </div>
                                </Link>
                            </li>

                            {/* <NavItemIcon href="/menu" alt="menu" src={Menu_Icon.src} /> */}
                            {/* <MenuDropdown /> */}

                            
                        </ul>) :
                        (<Link
                            href="/auth"
                            className="bg-white text-black px-3 py-2 rounded-lg hover:bg-zinc-300 transition duration-200 cursor-pointer"
                        >
                            Sign in / Sign up
                        </Link>)
                    }
                </div>
            </div>
        </nav >
    );
}
