"use client";
import { useState, useEffect } from "react";
import NoBackground from '@/assets/images/no-background.jpg'
import NoAvatar from '@/assets/images/no-avatar.png'
import useAuthStore from "@/contexts/auth-store";
import 'react-international-phone/style.css';
import { getMe } from "@/services/user";
import { editUsername } from "@/services/user";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Label = ({ label }: { label: string }) => (
    <label className="block text-sm font-normal mb-2 w-full">{label} <label className="text-red-500 text-lg">*</label></label>
);

// import { PhoneNumberUtil } from 'google-libphonenumber';
// const phoneUtil = PhoneNumberUtil.getInstance();
// const isPhoneValid = (phone: string) => {
//     try {
//         return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
//     } catch (error) {
//         return false;
//     }
// };

const ProfileSettingPage: React.FC = () => {
    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);

    const router = useRouter();

    // ✅ State Variables
    const [firstName, setFirstName] = useState(user?.first_name || "");
    const [lastName, setLastName] = useState(user?.last_name || "");


    // ✅ Auto-update when `user` state changes
    useEffect(() => {
        if (user) {
            setFirstName(user.first_name || "");
            setLastName(user.last_name || "");
        }
    }, [user]);


    // ✅ Handle Profile Info Update
    const handleUpdateInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await editUsername({first_name: firstName, last_name: lastName});

            // ✅ Show success toast
            toast.success("Profile Info Updated Successfully!");

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
        <div className="flex flex-col mx-5 sm:mx-10 md:mx-10 lg:mx-14 my-14 px-6">
            <h2 className="text-xl font-bold mb-6">Setting Profile</h2>
            <form onSubmit={handleUpdateInfo} className="space-y-5">
                <div className="flex flex-col space-y-6 w-1/2">
                    {/* First Name */}
                    <div className="flex items-center space-x-3">
                        <Label label="First Name" />
                        <input
                            type="text"
                            className="w-full p-2 border text-sm border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Last Name */}
                    <div className="flex items-center space-x-3">
                        <Label label="Last Name" />
                        <input
                            type="text"
                            className="w-full p-2 border text-sm border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    {/* Submit Button */}
                    <div className="flex justify-between">
                        <Link
                            href="/user/home"
                            className="sm:w-1/4 rounded-md transition shadow-md text-sm border-[2px] py-1 border-black hover:bg-zinc-200 text-center"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="sm:w-1/4 rounded-md transition shadow-md text-sm py-1 bg-black text-white hover:bg-zinc-700">
                            Submit
                        </button>
                    </div>
                </div>


            </form>
        </div>
    );
};

export default ProfileSettingPage;
