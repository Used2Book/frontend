"use client";

import { useEffect, useState, useRef, use } from "react";
import useAuthStore from "@/contexts/auth-store";
import chatService from "@/services/chat";
import { userProfile } from "@/services/user";
import { User } from "@/types/user";
import Image from "next/image";
import NoAvatar from "@/assets/images/no-avatar.png";

interface Message {
    senderId: string;
    receiverId: string;
    content: string;
    chatId: string;
    timestamp: string;
}

export default function ChatPage({ params }: { params: Promise<{ chatID: string }> }) {
    const resolvedParams = use(params);
    const chatId = resolvedParams.chatID;

    const user = useAuthStore((state) => state.user);

    const [messages, setMessages] = useState<Message[]>([]);
    const [profile, setProfile] = useState<User | null>(null);
    const [input, setInput] = useState("");
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const otherUserId = chatId.split("-").find((id) => id !== String(user?.id)) || "";

    if (!chatId.includes("-")) {
        setError("Invalid chat ID format.");
        return null;
    }

    useEffect(() => {
        if (!chatId || !user || !otherUserId) return;

        const fetchProfile = async () => {
            try {
                const client_id = parseInt(otherUserId, 10);
                const clientProfile = await userProfile(client_id);
                setProfile(clientProfile);
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError("Failed to load recipient profile.");
            }
        };

        fetchProfile();
    }, [chatId, user, otherUserId]);

    useEffect(() => {
        if (!chatId || !user) return;

        const { socket, notiSocket } = chatService.connect();
        console.log("ChatPage connected:", chatId, "userId:", user.id);

        socket.emit("joinChat", chatId);
        chatService.joinChat(chatId); // Ensure notiSocket joins the room

        chatService
            .getChatMessages(chatId)
            .then((initialMessages) => {
                setMessages(initialMessages);
                setError(null);
            })
            .catch((err: any) => {
                console.log("Chat ID:", chatId, "User ID:", user?.id, "Error:", err);
                if (err.response?.status === 403) {
                    setError(`Unauthorized: ${err.response.data.error || "Forbidden"}`);
                } else {
                    setError("Failed to load chat.");
                }
                setMessages([]);
            });

        const handleNewMessage = (message: Message) => {
            console.log("ChatPage received message:", message);
            if (message.chatId === chatId) {
                setMessages((prev) => [...prev, message]);
                // Mark as read if user is currently viewing this chat
                if (user?.id) {
                    markMessageAsRead(user?.id, chatId);
                }
            }
        };

        chatService.onMessage(handleNewMessage);

        return () => {
            socket.off("receiveMessage", handleNewMessage);
        };
    }, [chatId, user]);

    const markMessageAsRead = async (userId: string, chatId: string) => {
        const token = useAuthStore.getState().token;
        if (!token) {
            console.warn("No token available to mark message as read");
            return;
        }
        try {
            console.log("Marking new message as read:", { userId, chatId });
            const response = await fetch("http://localhost:5001/notifications/mark-chat-read", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ user_id: userId, chatId }),
            });
            if (!response.ok) {
                console.error(`Failed to mark message as read: ${response.status} - ${await response.text()}`);
            } else {
                console.log("Message marked as read successfully");
                chatService.connect().notiSocket?.emit("chatRead", { userId, chatId });
            }
        } catch (err) {
            console.error("Error marking message as read:", err);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!user || !input.trim() || !otherUserId) {
            setError("Cannot send message.");
            return;
        }
        chatService.sendMessage(otherUserId, input, chatId);
        setInput("");
        setError(null);
    };

    if (error) {
        return (
            <div className="h-screen flex flex-col">
                <div className="bg-gray-200 p-4">
                    {profile && (
                        <p className="text-sm font-semibold">
                            {profile.first_name} {profile.last_name}
                        </p>
                    )}
                    <p className="text-red-500">{error}</p>
                </div>
                <div className="flex-1 overflow-y-auto mt-4 px-4 items-center"></div>
                <div className="flex p-4">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message"
                        className="flex-1 p-2 border rounded-l"
                        disabled
                    />
                    <button className="p-2 bg-blue-500 text-white rounded-r" disabled>
                        Send
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col">
            <div className="bg-gray-200 p-4">
                <h1 className="text-base font-bold">
                    {profile ? `${profile.first_name} ${profile.last_name}` : `Chat: ${chatId}`}
                </h1>
            </div>
            <div className="flex-1 overflow-y-auto mt-4 px-4 scrollbar-hide">
                {messages.map((msg, index) => {
                    const isCurrentUser = msg.senderId === String(user?.id);
                    return (
                        <div key={index} className="mb-2">
                            {!isCurrentUser && profile && (
                                <div className="flex items-end gap-2">
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                        <Image
                                            src={profile.picture_profile || NoAvatar.src}
                                            alt={`${profile.first_name} ${profile.last_name}'s profile`}
                                            fill
                                            style={{ objectFit: "cover" }}
                                        />
                                    </div>
                                    <div className="flex items-end gap-2">
                                        <div className="p-2 rounded bg-gray-100 max-w-xs">
                                            {msg.content}
                                        </div>
                                        <span className="text-xxxs text-gray-500">
                                            {new Date(msg.timestamp).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                </div>
                            )}
                            {isCurrentUser && (
                                <div className="flex items-end justify-end gap-2">
                                    <span className="text-xxxs text-gray-500">
                                        {new Date(msg.timestamp).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                    <div className="p-2 rounded bg-blue-100 max-w-xs">
                                        {msg.content}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
            <div className="sticky bottom-0 left-0 right-0 bg-white px-4 py-2 flex pb-24">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message"
                    className="flex-1 p-2 border rounded-l"
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                    onClick={handleSend}
                    className="p-2 bg-black text-white rounded-r hover:bg-zinc-700"
                >
                    Send
                </button>
            </div>
        </div>
    );
}