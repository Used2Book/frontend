"use client";
import { useState, useEffect, useCallback, use} from "react";
import Image from "next/image";
import { User } from "@/types/user";
import ProfileNav from "@/app/user/components/profile-nav";
import useAuthStore from "@/contexts/auth-store";
import NoAvatar from "@/assets/images/no-avatar.png";
import NoBackground from "@/assets/images/no-background.jpg";
import ProfileSidebar from "@/app/user/components/profile-sidebar";
import { userProfile } from "@/services/user";
import Link from "next/link";
import { MessageCircleMore } from "lucide-react";
import chatHttpClient from "@/lib/chat-http-client";

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const clientID = parseInt(resolvedParams.id);
    const user = useAuthStore((state) => state.user);

    const [client, setClient] = useState<User | null>(null);
    const [profilePicture, setProfilePicture] = useState<string>(NoAvatar.src);
    const [backgroundPicture, setBackgroundPicture] = useState<string>(NoBackground.src);
    const [error, setError] = useState<string | null>(null);
    const [chatLink, setChatLink] = useState<string | null>(null);

    const isMe = user?.id === clientID

    // Fetch user profile once clientID is available
    useEffect(() => {
        if (!clientID) return;

        const fetchClientProfile = async () => {
            try {
                const client_profile = await userProfile(clientID);
                setClient(client_profile);

                setProfilePicture(
                    client_profile?.picture_profile?.trim() ? client_profile.picture_profile : NoAvatar.src
                );
                setBackgroundPicture(
                    client_profile?.picture_background?.trim() ? client_profile.picture_background : NoBackground.src
                );
            } catch (error) {
                console.error("Error fetching user profile:", error);
                setError("Failed to load profile. Please try again.");
            }
        };

        fetchClientProfile();
    }, [clientID]);

    // Use useCallback to memoize the chat initiation function
    const handleStartChat = useCallback(async () => {
        if (!user || !client) {
            setError("You must be logged in to start a chat.");
            return;
        }

        try {
            const response = await chatHttpClient.post("/chat/start", {
                senderId: String(user.id),
                receiverId: String(client.id),
            });
            const chatId = response.data.chatId;
            if (!chatId.includes("-")) {
                throw new Error("Invalid chat ID format received from server.");
            }
            setChatLink(`/user/chat/${chatId}`);
            setError(null); // Clear any previous error
        } catch (error) {
            console.error("Error starting chat:", error);
            setError("Failed to start chat. Please try again.");
        }
    }, [user, client]); // Ensure dependencies are correct

    // Only render the Link or button once, avoiding re-renders
    const chatButton = (
        <div className="p-2 hover:bg-sky-100 hover:border-sky-400 rounded-full border-sky-200 border-[1px] transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95">
            {chatLink ? (
                <Link href={chatLink} prefetch={false}>
                    <MessageCircleMore size={20} color="blue" />
                </Link>
            ) : (
                <button onClick={handleStartChat} className="flex items-center">
                    <MessageCircleMore size={20} color="blue" />
                </button>
            )}
        </div>
    );

    return (
        <div>
            <div className="flex flex-col bg-white w-full">
                {/* Background Image Section */}
                <div className="relative w-full h-52 bg-orange-400">
                    <Image
                        src={backgroundPicture}
                        alt="User profile background"
                        fill
                        objectFit="cover"
                        objectPosition="80% 80%"
                        className="object-cover"
                    />
                </div>

                {/* Profile Picture Section */}
                <div className="flex items-center gap-4 ml-20 -mt-16">
                    <div className="flex-1">
                        <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-40 lg:h-40 overflow-hidden rounded-full border-[15px] border-white">
                            <Image
                                src={profilePicture}
                                alt="User profile"
                                fill
                                objectFit="cover"
                                className="object-cover"
                            />
                        </div>
                    </div>

                    <div className="flex justify-between mt-10 w-full pr-20">
                        <p className="font-semibold text-lg">{client?.first_name} {client?.last_name}</p>
                        {error && <p className="text-red-500">{error}</p>}
                        {isMe ? <></> : chatButton}
                    </div>
                </div>
            </div>
            <div className="flex flex-1 overflow-hidden h-screen">
                <div className="w-1/4">
                    {client ? <ProfileSidebar clientID={client.id} /> : <p>Loading...</p>}
                </div>
                <div className="w-3/4 overflow-y-auto">
                    {client ? <ProfileNav clientID={client.id} /> : <p>Loading...</p>}
                </div>
            </div>
        </div>
    );
}