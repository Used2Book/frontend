"use client";

import { useEffect, useState } from "react";
import useAuthStore from "@/contexts/auth-store";
import chatService from "@/services/chat";
import Link from "next/link";
import Image from "next/image";
import NoAvatar from "@/assets/images/no-avatar.png";
import { Message } from "@/types/chat";
import { User } from "@/types/user";
import { userProfile } from "@/services/user";

interface Chat {
    _id: string;
    lastMessage: {
        senderId: string;
        content: string;
        timestamp: string;
    };
}

interface Notification {
    chatId: string;
    type: string;
}

export default function ChatList() {
    const user = useAuthStore((state) => state.user);
    const [chats, setChats] = useState<Chat[]>([]);
    const [unreadChatIds, setUnreadChatIds] = useState<Set<string>>(new Set());
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;
    
        const { socket, notiSocket } = chatService.connect();
    
        fetchChats();
    
        const handleNewMessage = (message: Message) => {
            console.log("ChatList received message:", message);
            const isInvolved =
                message.senderId === String(user.id) ||
                message.receiverId === String(user.id);
            if (!isInvolved) return;
    
            setChats((prevChats) => {
                const idx = prevChats.findIndex((c) => c._id === message.chatId);
                const chatToUpdate = idx >= 0 ? { ...prevChats[idx] } : {
                    id: message.chatId,
                    lastMessage: { senderId: "", content: "", timestamp: "" }
                };
                chatToUpdate.lastMessage = {
                    senderId: message.senderId,
                    content: message.content,
                    timestamp: message.timestamp,
                };
    
                const newChats = idx >= 0 ? [...prevChats] : [chatToUpdate, ...prevChats];
                if (idx >= 0) {
                    newChats.splice(idx, 1);
                    newChats.unshift(chatToUpdate);
                }
    
                if (message.senderId !== String(user.id)) {
                    setUnreadChatIds((prev) => new Set(prev).add(message.chatId));
                }
                return newChats;
            });
        };
    
        const handleChatNotification = ({ chat }: { chat: number }) => {
            console.log("ChatList unread_counts:", chat);
            fetchUnreadChats();
        };
    
        chatService.onMessage(handleNewMessage);
        chatService.onSent(handleNewMessage);
        chatService.onChatNotification(handleChatNotification);
    
        // Join all chat rooms after fetching chats
        const joinChatRooms = async () => {
            const userChats = await chatService.getUserChats(String(user.id));
            userChats.forEach(chat => chatService.joinChat(chat._id));
        };
        joinChatRooms();
    
        return () => {
            notiSocket.off("receiveMessage", handleNewMessage);
            socket.off("messageSent", handleNewMessage);
            notiSocket.off("unread_counts", handleChatNotification);
        };
    }, [user]);

    const fetchChats = async () => {
        if (!user) return;
        try {
            const userChats = await chatService.getUserChats(String(user.id));
            setChats(userChats);
            setError(null);
            await fetchUnreadChats();
        } catch (err: any) {
            if (err.message?.includes("No chats found")) {
                setError("You have no active chats yet.");
            } else {
                setError("Failed to fetch chats.");
            }
            setChats([]);
        }
    };

    const fetchUnreadChats = async () => {
        if (!user) return;
        try {
            const response = await fetch(`http://localhost:5001/notifications/unread?user_id=${user.id}`, {
                headers: { Authorization: `Bearer ${useAuthStore.getState().token}` },
            });
            const { chat } = await response.json();
            console.log("Unread chat count:", chat);
            if (chat > 0) {
                const unreadNotis = await fetch(`http://localhost:5001/notifications/unread-details?user_id=${user.id}`, {
                    headers: { Authorization: `Bearer ${useAuthStore.getState().token}` },
                });
                const notis: Notification[] = await unreadNotis.json();
                console.log("Unread notifications:", notis);
                const unreadIds = new Set<string>(notis.filter(n => n.type === "chat").map(n => n.chatId));
                console.log("Unread chat IDs:", Array.from(unreadIds));
                setUnreadChatIds(unreadIds);
            } else {
                setUnreadChatIds(new Set());
            }
        } catch (err) {
            console.error("Error fetching unread chats:", err);
            setUnreadChatIds(new Set());
        }
    };

    return (
        <div className="p-4 h-screen bg-gray-50">
            <h1 className="text-xl font-bold text-center">Chats</h1>
            {error ? (
                <p className="text-red-500">{error}</p>
            ) : chats.length === 0 ? (
                <p>No active chats yet.</p>
            ) : (
                <ul className="mt-4 space-y-2">
                    {chats.map((chat) => {
                        const [u1, u2] = chat._id.split("-");
                        const UserId = u1 === String(user?.id) ? u2 : u1;

                        return (
                            <li key={chat._id}>
                                <ChatListItem chat={chat} UserId={UserId} isUnread={unreadChatIds.has(chat._id)} />
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

function ChatListItem({
    chat,
    UserId,
    isUnread,
}: {
    chat: Chat;
    UserId: string;
    isUnread: boolean;
}) {
    const { senderId, content, timestamp } = chat.lastMessage;
    const timeStr = new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
    const [profile, setProfile] = useState<User | null>(null);

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
        console.log("Chat ID:", chat._id, "isUnread:", isUnread);
    }, [UserId]);

    if (!profile) return null;

    return (
        <Link href={`/user/chat/${chat._id}`}>
            <div className={`flex items-center gap-3 hover:bg-gray-100 rounded-md px-2 py-1 ${isUnread ? "bg-blue-200" : ""}`}>
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                        src={profile?.picture_profile || NoAvatar.src}
                        alt={`${profile.first_name} ${profile.last_name}'s profile`}
                        fill
                        objectFit="cover"
                    />
                </div>
                <div className="flex-1 flex justify-between p-2">
                    <div className="flex-col space-y-1 relative">
                        <p className={`text-sm font-semibold text-ellipsis overflow-hidden whitespace-nowrap ${isUnread ? "font-bold" : ""}`}>
                            {`${profile.first_name} ${profile.last_name}`.length > 13
                                ? `${profile.first_name} ${profile.last_name}`.slice(0, 13) + "..."
                                : `${profile.first_name} ${profile.last_name}`}
                        </p>
                        <p className={`text-xs ${isUnread ? "font-bold text-blue-500" : "text-gray-500"}`}>
                            {content.length > 20 ? content.slice(0, 20) + "..." : content}
                        </p>
                    </div>
                    <p className="text-xxs text-gray-500 py-1">{timeStr}</p>
                </div>
            </div>
        </Link>
    );
}