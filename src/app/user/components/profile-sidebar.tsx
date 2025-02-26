import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquareQuote,BookUser } from "lucide-react";
import { User } from "@/types/user";
import { userProfile } from "@/services/user";
interface ProfileSidebarProps {
    user: User;
  }
  
const ProfileSidebar: React.FC<{clientID: number}> = ({clientID}) => {
    const [client, setClient] = useState<User | null>(null);

    useEffect(() => {
        const fetchClientProfile = async () => {
            try {
                const client_profile = await userProfile(clientID);
                setClient(client_profile);
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };
    
        fetchClientProfile(); // ✅ Call the function inside useEffect
    
    }, [clientID]); // ✅ Correct dependency array

    return (
        <div className="relative h-full px-5">
            <div className="w-full max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 border border-gray-200">
                {/* Quote Section */}
                <div className="mb-4 p-3 bg-blue-100 rounded-md text-blue-700">
                    <div className="flex items-center space-x-2">
                        <MessageSquareQuote size={20} />
                        <h3 className="text-md font-semibold">Favorite Quote</h3>
                    </div>
                    <p className="text-gray-700 mt-2 italic">
                        {client?.quote || "No quote available."}
                    </p>
                </div>

                {/* Bio Section */}
                <div className="p-3 bg-gray-100 rounded-md">
                <div className="flex items-center space-x-2">
                    <BookUser size={20}/>
                    <h3 className="text-md font-semibold text-gray-700">Bio</h3>
                </div>
                    <p className="text-gray-600 mt-2">
                        {client?.bio || "No bio available. Update your profile to add one."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProfileSidebar;
