import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/images/used2book-logo.png";
import LogInModal from "@/app/auth/components/login";
import SignUpModal from "@/app/auth/components/signup";
import AuthModal from "@/app/auth/components/auth";
export default function NavLinkNoAuth() {
    return (
        <nav className="bg-black top-0 left-0 w-full z-10 px-4 sm:px-10 py-3 text-xs md:text-sm font-medium text-white">
            <div className="flex flex-col lg:flex-row xl:flex-row flex-wrap justify-center md:justify-between lg:justify-between items-center">
                <div className="flex flex-col lg:flex-row xl:flex-row flex-wrap justify-center md:justify-between lg:justify-between items-center space-x-2 md:space-x-10">

                    {/* Logo */}
                    <div className="w-auto max-w-[40px] sm:max-w-[60px] md:max-w-[80px]">
                        <Image src={Logo} alt="Used2Book Logo" layout="responsive" />
                    </div>

                </div>

                <div>
                    <ul className="flex space-x-7 text-xs sm:text-xs md:text-sm font-medium">
                        <li>
                            <AuthModal />
                        </li>
                    </ul>
                </div>
            </div>
        </nav >
    );
}
