"use client";
import { useState, useEffect } from "react";
import NoBackground from '@/assets/images/no-background.jpg'
import NoAvatar from '@/assets/images/no-avatar.png'
import useAuthStore from "@/contexts/auth-store";
import 'react-international-phone/style.css';
import { getMe } from "@/services/user";
import { uploadProfileImage, uploadBackgroundImage, editPreferrence } from "@/services/user";
import UserImgSetting from "@/app/user/components/userImgSetting";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Label = ({ label }: { label: string }) => (
    <label className="block text-sm font-normal mb-2">{label}</label>
);


const PreferrenceSettingPage: React.FC = () => {
    const router = useRouter();

    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);

    // ✅ State Variables
    const [quote, setQuote] = useState(user?.quote || "");
    const [bio, setBio] = useState(user?.bio || "");


    const [profilePicture, setProfilePicture] = useState<string | any>(
        user?.picture_profile && user.picture_profile !== "" ? user.picture_profile : NoAvatar
    );

    const [backgroundPicture, setBackgroundPicture] = useState<string | any>(
        user?.picture_background && user.picture_background !== "" ? user.picture_background : NoBackground
    );

    // console.log("user?.picture_peofile:", user?.picture_profile)

    // ✅ Auto-update when `user` state changes
    useEffect(() => {
        if (user) {
            setQuote(user.quote || "");
            setBio(user.bio || "");
            setProfilePicture(user?.picture_profile || NoAvatar);
            setBackgroundPicture(user?.picture_background || NoBackground);
            console.log("user?.picture_peofile-useEffect:", user?.picture_profile)
        }
    }, [user]);


    // ✅ Handle Profile Image Upload
    const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files?.[0]) return;
        const file = event.target.files[0];

        try {
            const uploadedUrl = await uploadProfileImage(file);

            setProfilePicture(uploadedUrl);
            // ✅ Refresh user data in Zustand & UI
            const updatedUser = await getMe();
            if (updatedUser) {
                setUser(updatedUser);
            }

            toast.success("Profile Image Updated Successfully!");
        } catch (error) {
            toast.error("Profile Image Upload Failed");
        }
    };

    // ✅ Handle Background Image Upload
    const handleBackgroundImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files?.[0]) return;
        const file = event.target.files[0];

        try {
            const uploadedUrl = await uploadBackgroundImage(file);

            // ✅ Refresh user data in Zustand & UI
            const updatedUser = await getMe();
            if (updatedUser) {
                setUser(updatedUser);
            }

            setBackgroundPicture(uploadedUrl);
            toast.success("Background Image Updated Successfully!");
        } catch (error) {
            toast.error("Background Image Upload Failed");
        }
    };

    // ✅ Handle Profile Info Update
    const handleUpdateInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await editPreferrence({ quote, bio });

            toast.success("Profile Preferrence Update Successfully!");
            
            // ✅ Wait for 1 second, then navigate
            setTimeout(async () => {
                const updatedUser = await getMe();
                if (updatedUser) {
                    setUser(updatedUser);
                    router.push("/user/profile"); // 🔹 Navigate after toast
                }
            }, 1000);

        } catch (error) {
            toast.error("Failed to Update Profile Info");
        }
    };


    return (
        <div>
            <div className="flex flex-col justify-center items-center bg-white w-full">
                {/* Background Image Section */}
                <UserImgSetting
                    handleChangeBackgroundImage={handleBackgroundImageUpload}
                    handleChangeProfileImage={handleProfileImageUpload}
                    userBackground={backgroundPicture}
                    userProfile={profilePicture}
                />

                {/* User Name */}
                <div className="mb-3">
                    <p className="text-center font-semibold text-lg md:text-xl">{user?.first_name}</p>
                    <p className="text-center mt-1 font-light text-xs text-orange-800 md:text-sm">
                        Quote: <span className="italic">{user?.quote}</span>
                    </p>
                </div>
            </div>

            <div className="flex flex-col justify-center mx-5 sm:mx-10 md:mx-10 lg:mx-20 my-5 px-6 sm:px-10 md:px-20 lg:px-60">
                <h2 className="text-xl font-bold mb-6">Setting Preferrence</h2>
                <form onSubmit={handleUpdateInfo} className="space-y-5">
                    <div className="flex flex-col space-y-5">
                        <div className="">
                            <Label label="Quote" />
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                value={quote}
                                onChange={(e) => setQuote(e.target.value)}
                                required
                            />
                        </div>

                        {/* Bio Input - Large Size */}
                        <div className="">
                            <Label label="Bio" />
                            <textarea
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 
                   resize-none h-32 text-lg"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                required
                            />
                        </div>

                    </div>


                    {/* Submit Button */}
                    <div className="flex justify-between space-x-3 py-5">
                        <Link
                            href="/user/home"
                            className="w-full sm:w-1/4 rounded-md transition shadow-md text-sm border-[2px] py-1 border-black hover:bg-zinc-200 text-center"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="w-full sm:w-1/4 rounded-md transition shadow-md text-sm py-1 bg-black text-white hover:bg-zinc-700">
                            Submit
                        </button>
                    </div>
                </form>
            </div>

        </div>
    );
};

export default PreferrenceSettingPage;
