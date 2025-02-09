"use client";
import { useState } from "react";
import Image from "next/image";
import { UserInfo } from "@/assets/mockData/user";
import { User } from "@/types/user";
import ProfileNav from "./profile-nav";

const ProfileCard: React.FC = () => {
    const [userInfo, setuserInfo] = useState<User>(UserInfo);

    return (
        <div>
            <div className="flex flex-col justify-center items-center bg-white w-full">
                {/* Background Image Section */}
                <div className="relative w-full h-52 bg-orange-400">
                    <Image
                        src={userInfo.picture_background}
                        alt="User profile background"
                        layout="fill"
                        objectFit="cover"
                        objectPosition="80% 80%"
                        className="object-cover"
                    />
                </div>

                {/* Profile Picture Section */}
                <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 overflow-hidden rounded-full bg-teal-400 -mt-16 border-8 border-white">
                    <Image
                        src={userInfo.picture}
                        alt="User profile"
                        layout="fill"
                        objectFit="cover"
                        className="object-cover"
                    />
                </div>

                {/* User Name */}
                <div className="mb-3">
                    <p className="text-center font-semibold text-lg">{userInfo.name}</p>
                    <p className="text-center mt-1 font-light text-xs text-orange-800">
                        Quote : <span className="italic">{userInfo.name}</span>
                    </p>
                </div>
            </div>
            <div className="w-full border-y-[1px] border-zinc-300 shadow-[0px_2px_4px_rgba(0,0,0,0.1)]">
                <ProfileNav />
            </div>

        </div>
    );
};

export default ProfileCard;
