"use client";

import { useEffect, useState } from "react";
import useAuthStore from "@/contexts/auth-store";
import chatService from "@/services/chat"; // Your socket + HTTP service
import Link from "next/link";
import Image from "next/image";
import NoAvatar from "@/assets/images/no-avatar.png";
import { Message } from "@/types/chat";
import { User } from "@/types/user";
import { userProfile } from "@/services/user";
interface Chat {
    _id: string;  // e.g. "1-2"
    lastMessage: {
        senderId: string;
        content: string;
        timestamp: string;
    };
}

// Example ChatList as a stand-alone component
export default function ChatList() {
    const user = useAuthStore((state) => state.user);
    const [chats, setChats] = useState<Chat[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        // 1) Connect to Socket.IO once
        const socket = chatService.connect();

        // 2) Fetch initial list of chats from server
        fetchChats();

        // 3) On new messages, update lastMessage in local state
        const handleNewMessage = (message: Message) => {
            // Only update if it's in the user's chat
            const isInvolved =
                message.senderId === String(user.id) ||
                message.receiverId === String(user.id);
            if (!isInvolved) return;

            // Update the local `chats` array so its lastMessage is this new message
            setChats((prevChats) => {
                // Find the chat that matches message.chatId
                const idx = prevChats.findIndex((c) => c._id === message.chatId);
                if (idx < 0) {
                    // If that chat is not in the list, you can either:
                    //  - ignore, or
                    //  - create a new one (not shown)
                    return prevChats;
                }

                // Copy the chat that needs updating
                const chatToUpdate = { ...prevChats[idx] };
                chatToUpdate.lastMessage = {
                    senderId: message.senderId,
                    content: message.content,
                    timestamp: message.timestamp,
                };

                // Move that updated chat to the front (optional)
                const newChats = [...prevChats];
                newChats.splice(idx, 1);           // remove old position
                newChats.unshift(chatToUpdate);    // put updated chat at front

                if (message.chatId && (message.senderId === String(user?.id) || message.receiverId === String(user?.id))) {
                    fetchChats();  // re-fetch entire list from DB
                }

                return newChats;
            });
        };

        // Listen for both 'receiveMessage' and 'messageSent' if you still use both
        socket.on("receiveMessage", handleNewMessage);
        socket.on("messageSent", handleNewMessage);

        // Cleanup on unmount
        return () => {
            socket.off("receiveMessage", handleNewMessage);
            socket.off("messageSent", handleNewMessage);
            chatService.disconnect();
        };
    }, [user]);

    // Separate function to fetch chats from the server
    const fetchChats = async () => {
        if (!user) return;
        try {
            const userChats = await chatService.getUserChats(String(user.id));
            setChats(userChats);
            setError(null);
        } catch (err: any) {
            if (err.message?.includes("No chats found")) {
                setError("You have no active chats yet.");
            } else {
                setError("Failed to fetch chats. Please try again.");
            }
            setChats([]);
        }
    };



    return (
        <div className="p-4 h-screen bg-gray-200">
            <h1 className="text-xl font-bold text-center">Chats</h1>
            {error ? (
                <p className="text-red-500">{error}</p>
            ) : chats.length === 0 ? (
                <p>No active chats yet.</p>
            ) : (
                <ul className="mt-4 space-y-2">
                    {chats.map((chat) => {
                        // Extract other user ID (e.g., if "_id" = "3-7", you are "3", then other is "7")
                        // This depends on how you generate your chatId
                        // For simplicity, we do:
                        const [u1, u2] = chat._id.split("-");
                        const UserId = u1 === String(user?.id) ? u2 : u1;

                        return (
                            <li key={chat._id}>
                                <ChatListItem chat={chat} UserId={UserId} />
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

/** Child component that shows the other user's avatar, name, and last message. */
function ChatListItem({
    chat,
    UserId,
}: {
    chat: Chat;
    UserId: string;
}) {
    // Show the last message snippet
    const { senderId, content, timestamp } = chat.lastMessage;
    const timeStr = new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
    const [profile, setProfile] = useState<User | null>(null)
    // For the other user's profile, you can do a custom hook or a separate fetch:
    // Example placeholder usage
    // (You might do a custom <Avatar userId={otherUserId} /> that fetches or uses some store.)
    // For brevity, let's assume you have the data or do a minimal fetch.
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const clientProfile = await userProfile(parseInt(UserId));
                setProfile(clientProfile);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };
        fetchProfile();
    }, [UserId]);

    if (!profile) return null;
    return (
        <Link href={`/user/chat/${chat._id}`}>
            <div className="flex items-center gap-3 hover:bg-gray-100 rounded-md px-2 py-1">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                        src={profile?.picture_profile || NoAvatar.src}
                        alt={`${profile.first_name} ${profile.last_name}'s profile`}
                        fill
                        objectFit="cover"
                    />
                </div>
                <div className="flex-1 flex justify-between p-2">
                    <div className="flex-col space-y-1">
                        <p className="text-sm font-semibold text-ellipsis overflow-hidden whitespace-nowrap">
                            {`${profile.first_name} ${profile.last_name}`.length > 13
                                ? `${profile.first_name} ${profile.last_name}`.slice(0, 13) + "..."
                                : `${profile.first_name} ${profile.last_name}`}
                        </p>
                        <p className="text-gray-500 text-xs">
                            {content.length > 20 ? content.slice(0, 20) + "..." : content}
                        </p>
                    </div>
                    <p className="text-xxs text-gray-500 py-1">{timeStr}</p>
                </div>
            </div>
            
        </Link>
    );
}
