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
    // 1) Resolve the route params (be sure you actually need this 'Promise' usage).
    const resolvedParams = use(params);
    const chatId = resolvedParams.chatID;

    const user = useAuthStore((state) => state.user);

    const [messages, setMessages] = useState<Message[]>([]);
    const [profile, setProfile] = useState<User | null>(null);
    const [input, setInput] = useState("");
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Derive other user ID from chatId
    const otherUserId =
        chatId.split("-").find((id) => id !== String(user?.id)) || "";

    // Basic validation
    if (!chatId.includes("-")) {
        setError("Invalid chat ID format. Please check the conversation link.");
        return null;
    }

    // 2) Fetch other user's profile
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

    // 3) Connect socket, join chat room, fetch initial messages, set up listeners
    useEffect(() => {
        if (!chatId || !user) return;

        // Connect to Socket.IO
        const socket = chatService.connect();
        console.log("Connected to chat with chatId:", chatId, "userId:", user.id);

        // **Join** the room named by `chatId`
        socket.emit("joinChat", chatId);

        // Fetch existing messages
        chatService
            .getChatMessages(chatId)
            .then((initialMessages) => {
                setMessages(initialMessages);
                setError(null);
            })
            .catch((err: any) => {
                console.log(
                    "Chat ID causing error:",
                    chatId,
                    "User ID:",
                    user?.id,
                    "Error:",
                    err
                );
                if (err.response?.status === 403) {
                    setError(`Unauthorized access: ${err.response.data.error || "Forbidden"}`);
                } else if (err.message.includes("Invalid chat ID format")) {
                    setError("Invalid chat ID. Please check the conversation link.");
                } else {
                    setError("Failed to load chat. Please try again.");
                }
                setMessages([]);
            });

        // **Listen** for messages in this chat room
        const handleNewMessage = (message: Message) => {
            // Make sure it's for our current chat
            if (message.chatId === chatId) {
                setMessages((prev) => [...prev, message]);
            }
        };

        socket.on("receiveMessage", handleNewMessage);

        // You can keep "handleSentMessage" if you want to handle the "messageSent" event
        const handleSentMessage = (message: Message) => {
            if (message.chatId === chatId) {
                setMessages((prev) => [...prev, message]);
            }
        };
        // socket.on("messageSent", handleSentMessage);

        // Listen for errors
        socket.on("error", (errMsg: string) => {
            console.error("Socket error:", errMsg);
            setError(errMsg);
        });

        // Cleanup on unmount
        return () => {
            socket.off("receiveMessage", handleNewMessage);
            socket.off("messageSent", handleSentMessage);
            socket.off("error");
            chatService.disconnect();
        };
    }, [chatId, user]);

    // 4) Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // 5) Send messages
    const handleSend = () => {
        if (!user || !input.trim() || !otherUserId) {
            setError("Cannot send message: Invalid user or recipient.");
            return;
        }
        chatService.sendMessage(otherUserId, input, chatId);
        setInput("");
        setError(null);
    };

    // If there's an error, render an error UI
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
                <div className="flex-1 overflow-y-auto mt-4 px-4 items-center">
                    {/* Placeholder for error state */}
                </div>
                <div className="flex p-4">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message"
                        className="flex-1 p-2 border rounded-l"
                        disabled
                    />
                    <button
                        className="p-2 bg-blue-500 text-white rounded-r"
                        disabled
                    >
                        Send
                    </button>
                </div>
            </div>
        );
    }

    // 6) Main chat UI
    return (
        <div className="h-screen flex flex-col ">
            <div className="bg-gray-200 p-4">
                <h1 className="text-base font-bold">
                    {profile
                        ? `${profile.first_name} ${profile.last_name}`
                        : `Chat: ${chatId}`}
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

            {/* <div className="flex px-4 pb-20 sticky"> */}
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
