"use client";
import { useState } from "react";
import Image from "next/image";
import { UserInfo } from "@/assets/mockData/user";
import { User } from "@/types/user";
import ProfileNav from "./profile-nav";
import useAuthStore from "@/contexts/auth-store";
import useStore from "@/contexts/useStore";
import NoAvatar from '@/assets/images/no-avatar.png'
import NoBackground from '@/assets/images/no-background.jpg'
import ProfileSidebar from '@/app/user/components/profile-sidebar';
const ProfileCard: React.FC = () => {
    const user = useStore(useAuthStore, (state) => state.user);

    const profilePicture = user?.picture_profile && user.picture_profile !== ""
        ? user.picture_profile
        : NoAvatar;

    const backgroundPicture = user?.picture_background && user.picture_background !== ""
        ? user.picture_background
        : NoBackground;
    return (
        <div>
            <div className="flex flex-col bg-white w-full">
                {/* Background Image Section */}
                <div className="relative w-full h-52 bg-orange-400">
                    <Image
                        src={backgroundPicture}
                        alt="User profile background"
                        layout="fill"
                        objectFit="cover"
                        objectPosition="80% 80%"
                        className="object-cover"
                    />
                </div>

                {/* Profile Picture Section */}
                <div className="flex items-center gap-4 ml-20 -mt-16">
                    {/* Profile Image */}
                    <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-40 lg:h-40 overflow-hidden rounded-full bg-teal-400 border-[15px] border-white">
                        <Image
                            src={profilePicture}
                            alt="User profile"
                            layout="fill"
                            objectFit="cover"
                            className="object-cover"
                        />
                    </div>

                    {/* User Name */}
                    <p className="font-semibold text-lg mt-10 ml-5">{user?.first_name} {user?.last_name}</p>
                </div>

                
            </div>
            {/* <div className="w-full border-zinc-300 shadow-[0px_2px_4px_rgba(0,0,0,0.1)]">
            </div> */}
            <div className="flex flex-1 overflow-hidden h-screen">
                {/* Sidebar - 1/3 width */}
                {/* Sidebar - 1/3 width */}
                <div className="w-1/4">
                    {user ? <ProfileSidebar user={user} /> : <p>Loading...</p>}
                </div>


                {/* Main Content - 2/3 width */}
                <div className="w-3/4 overflow-y-auto">
                    <ProfileNav />
                </div>
            </div>



        </div>
    );
};

export default ProfileCard;
