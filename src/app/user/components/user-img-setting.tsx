import React from "react";
import Image from "next/image";
import { Camera } from "lucide-react"; // Assuming you're using lucide-react for the Camera icon

// ✅ Background Image Component
const BackgroundImageSection: React.FC<{ handleChangeBackgroundImage: (event: React.ChangeEvent<HTMLInputElement>) => void; userBackground: string; }> = ({ handleChangeBackgroundImage, userBackground }) => {
    return (
        <div className="relative w-full h-52 bg-orange-400">
            <Image src={userBackground} alt="Background" fill objectFit="cover" className="object-cover" />
            <input type="file" accept="image/*" className="hidden" id="background-upload" onChange={handleChangeBackgroundImage} />
            <label htmlFor="background-upload" className="absolute bottom-3 right-3 flex space-x-2 justify-center items-center bg-gray-500 text-white p-2 rounded-md cursor-pointer">
                <Camera className="h-4 w-4" /> 
                <p>
                Edit
                </p>
            </label>
        </div>
    );
};

// ✅ Profile Image Component
const ProfileImageSection: React.FC<{ handleChangeProfileImage: (event: React.ChangeEvent<HTMLInputElement>) => void; userProfile: string; }> = ({ handleChangeProfileImage, userProfile }) => {
    return (
        <div className="relative">
            <div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden -mt-16">
                <Image src={userProfile} alt="Profile" fill objectFit="cover" className="object-cover" />
            </div>
            <input type="file" accept="image/*" className="hidden" id="profile-upload" onChange={handleChangeProfileImage} />
            <label htmlFor="profile-upload" className="absolute bottom-3 right-3 bg-gray-500 text-white p-2 rounded-full cursor-pointer">
                <Camera className="h-4 w-4" />
            </label>
        </div>
    );
};
// ✅ BackgroundImageSection Component
// const BackgroundImageSection: React.FC<{ handleChangeBackgroundImage: () => void; userBackground: string; }> = ({ handleChangeBackgroundImage, userBackground }) => {
//     return (
//         <div className="relative w-full h-52 bg-orange-400">
//             <Image
//                 src={userBackground}
//                 alt="User background background"
//                 fill
//                 objectFit="cover"
//                 objectPosition="80% 80%"
//                 className="object-cover"
//             />
//             <button
//                 type="button"
//                 onClick={handleChangeBackgroundImage}
//                 className="absolute bottom-3 right-3 bg-zinc-400 text-white text-xs rounded-md px-3 py-2 flex items-center gap-1 hover:bg-zinc-600"
//             >
//                 <Camera className="h-4 w-4" /> Edit Background Image
//             </button>
//         </div>
//     );
// };

// // ✅ ProfileImageSection Component
// const ProfileImageSection: React.FC<{ handleChangeProfileImage: () => void; userProfile: string; }> = ({ handleChangeProfileImage, userProfile }) => {
//     return (
//         <div className="relative">
//             {/* Profile Image Container */}
//             <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 overflow-hidden rounded-full bg-teal-400 -mt-16 border-8 border-white">
//                 <Image
//                     src={userProfile}
//                     alt="User profile"
//                     fill
//                     objectFit="cover"
//                     className="object-cover"
//                 />
//             </div>

//             {/* Edit Button */}
//             <button
//                 type="button"
//                 onClick={handleChangeProfileImage}
//                 className="absolute bottom-3 right-3 bg-zinc-400 text-white text-xs rounded-full p-1 flex items-center gap-1 hover:bg-zinc-600 z-50"
//             >
//                 <Camera className="h-4 w-4" />
//             </button>
//         </div>
//     );
// };

// ✅ UserImgSetting Component
const UserImgSetting: React.FC<{ 
    handleChangeBackgroundImage: (event: React.ChangeEvent<HTMLInputElement>) => void; 
    handleChangeProfileImage: (event: React.ChangeEvent<HTMLInputElement>) => void; 
    userBackground: string;
    userProfile: string;
}> = ({ handleChangeBackgroundImage, handleChangeProfileImage, userBackground, userProfile }) => {
    return (
        <>
            <BackgroundImageSection handleChangeBackgroundImage={handleChangeBackgroundImage} userBackground={userBackground} />
            <ProfileImageSection handleChangeProfileImage={handleChangeProfileImage} userProfile={userProfile} />
        </>
    );
};

export default UserImgSetting;
