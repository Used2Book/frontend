"use client";
import { useState, useEffect } from "react";
import NoBackground from "@/assets/images/no-background.jpg";
import NoAvatar from "@/assets/images/no-avatar.png";
import useAuthStore from "@/contexts/auth-store";
import { getMe, uploadProfileImage, uploadBackgroundImage, editProfile } from "@/services/user";
import UserImgSetting from "@/app/user/components/user-img-setting";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Label = ({ label }: { label: string }) => (
    <label className="block text-sm font-normal mb-2 w-28">{label}</label>
);

const ProfileSettingPage: React.FC = () => {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [quote, setQuote] = useState("");
    const [bio, setBio] = useState("");
    const [profilePicture, setProfilePicture] = useState<string | any>(NoAvatar);
    const [backgroundPicture, setBackgroundPicture] = useState<string | any>(NoBackground);

    useEffect(() => {
        if (user) {
            setFirstName(user.first_name || "");
            setLastName(user.last_name || "");
            setAddress(user.address || "");
            setQuote(user.quote || "");
            setBio(user.bio || "");
            setProfilePicture(user.picture_profile || NoAvatar);
            setBackgroundPicture(user.picture_background || NoBackground);
        }
    }, [user]);

    const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        try {
            const uploadedUrl = await uploadProfileImage(e.target.files[0]);
            setProfilePicture(uploadedUrl);
            const updatedUser = await getMe();
            if (updatedUser) setUser(updatedUser);
            toast.success("Profile image updated!");
        } catch {
            toast.error("Profile image upload failed");
        }
    };

    const handleBackgroundImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        try {
            const uploadedUrl = await uploadBackgroundImage(e.target.files[0]);
            setBackgroundPicture(uploadedUrl);
            const updatedUser = await getMe();
            if (updatedUser) setUser(updatedUser);
            toast.success("Background image updated!");
        } catch {
            toast.error("Background image upload failed");
        }
    };

    const handleUpdateInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await editProfile({
                first_name: firstName,
                last_name: lastName,
                address,
                quote,
                bio,
              });
              
            toast.success("Profile updated!");

            const updatedUser = await getMe();
            if (updatedUser) {
                setUser(updatedUser);
                // router.push("/user/profile");
            }
        } catch {
            toast.error("Failed to update profile info");
        }
    };
    const handleReset = () => {
        if (user) {
            setFirstName(user.first_name || "");
            setLastName(user.last_name || "");
            setAddress(user.address || "");
            setQuote(user.quote || "");
            setBio(user.bio || "");
            setProfilePicture(user.picture_profile || NoAvatar);
            setBackgroundPicture(user.picture_background || NoBackground);
        }
    }

    return (
        <div>
            <div className="flex flex-col justify-center items-center bg-white w-full">
                <UserImgSetting
                    handleChangeBackgroundImage={handleBackgroundImageUpload}
                    handleChangeProfileImage={handleProfileImageUpload}
                    userBackground={backgroundPicture}
                    userProfile={profilePicture}
                />
            </div>

            <div className="flex flex-col justify-center">
                <h2 className="text-xl font-bold mb-6 ml-10">Profile Setting</h2>
                <form onSubmit={handleUpdateInfo} className="space-y-5">
                    <div className="flex items-center ml-10">
                        <Label label="Name" />
                        <div className="flex space-x-4 flex-1">
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-1/3 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                placeholder="First Name"
                            />
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-1/3 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                placeholder="Last Name"
                            />
                        </div>
                    </div>

                    <hr className="border-gray-200" />

                    <div className="flex items-center ml-10">
                        <Label label="Address" />
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-3/5 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <hr className="border-gray-200" />

                    <div className="flex items-center ml-10">
                        <Label label="Quote" />
                        <input
                            type="text"
                            value={quote}
                            onChange={(e) => setQuote(e.target.value)}
                            className="w-3/5 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <hr className="border-gray-200" />

                    <div className="flex items-start ml-10 ">
                        <Label label="Bio" />
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-3/5 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none h-32 text-base"
                        />
                    </div>

                    <hr className="border-gray-200" />

                    <div className="flex ml-10 justify-start space-x-3 py-5">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="w-1/6 rounded-md transition shadow-md text-sm border-[2px] py-1 border-black hover:bg-zinc-200 text-center"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-1/6 rounded-md transition shadow-md text-sm py-1 bg-black text-white hover:bg-zinc-700"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileSettingPage;