import { io, Socket } from "socket.io-client";
import chatHttpClient from "@/lib/chat-http-client";
import useAuthStore from "@/contexts/auth-store";
import { Chat, Message } from "@/types/chat";

const NOTIFICATION_SOCKET_URL = "http://localhost:5001";
const CHAT_SOCKET_URL = "http://localhost:5002";

class ChatService {
    private socket: Socket | null = null;
    private notiSocket: Socket | null = null;

    connect(): { socket: Socket; notiSocket: Socket } {
        const token = useAuthStore.getState().token;
        const userId = useAuthStore.getState().user?.id;
        if (!token || !userId) throw new Error("No authentication token or user ID available");

        if (!this.socket) {
            this.socket = io(CHAT_SOCKET_URL, {
                auth: { token },
                transports: ["websocket"],
            });

            this.notiSocket = io(NOTIFICATION_SOCKET_URL, {
                query: { user_id: userId },
                transports: ["websocket"],
            });

            this.socket.on("connect", () => {
                console.log("Connected to chat service:", this.socket?.id);
            });

            this.notiSocket.on("connect", () => {
                console.log("Connected to notification service:", this.notiSocket?.id);
                this.notiSocket?.emit("get_unread_counts");
            });

            this.socket.on("connect_error", (error: Error) => {
                console.error("Chat connection error:", error.message);
            });

            this.notiSocket.on("connect_error", (error: Error) => {
                console.error("Notification connection error:", error.message);
            });
        }

        return { socket: this.socket, notiSocket: this.notiSocket };
    }

    joinChat(chatId: string): void {
        if (this.notiSocket) {
            this.notiSocket.emit("joinChat", chatId);
            console.log(`Joined chat room: ${chatId}`);
        }
    }

    onMessage(callback: (message: Message) => void): void {
        this.notiSocket?.on("receiveMessage", callback);
        this.socket?.on("receiveMessage", callback);
    }

    onSent(callback: (message: Message) => void): void {
        this.socket?.on("messageSent", callback);
    }

    onError(callback: (error: string) => void): void {
        this.socket?.on("error", callback);
    }

    onChatNotification(callback: (counts: { chat: number; comments: number }) => void): void {
        this.notiSocket?.on("unread_counts", callback);
    }

    sendMessage(receiverId: string, content: string, chatId: string): void {
        this.socket?.emit("sendMessage", { receiverId, content, chatId });
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        if (this.notiSocket) {
            this.notiSocket.disconnect();
            this.notiSocket = null;
        }
    }

    async getChatMessages(chatId: string): Promise<Message[]> {
        if (!chatId.includes("-")) {
            throw new Error("Invalid chatId format. Expected user1-user2.");
        }
        try {
            const response = await chatHttpClient.get(`/chat/${chatId}`);
            const userId = useAuthStore.getState().user?.id;
            const token = useAuthStore.getState().token;
            if (userId && token) {
                try {
                    console.log("Marking chat as read for:", { userId, chatId });
                    const markReadResponse = await fetch("http://localhost:5001/notifications/mark-chat-read", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ user_id: userId, chatId }),
                    });
                    if (!markReadResponse.ok) {
                        console.error(`Failed to mark chat as read: ${markReadResponse.status} - ${await markReadResponse.text()}`);
                    } else {
                        console.log("Chat marked as read successfully");
                        // Emit chatRead event to notify ChatList
                        this.notiSocket?.emit("chatRead", { userId, chatId });
                        console.log("Emitted chatRead:", { userId, chatId });
                    }
                } catch (fetchError) {
                    console.error("Error marking chat as read:", fetchError);
                }
            } else {
                console.warn("No userId or token available to mark chat as read");
            }
            console.log("Chat messages fetched:", response.data);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 403) {
                throw new Error(`Unauthorized access: ${error.response.data.error || "Forbidden"}`);
            }
            throw error;
        }
    }

    async getUserChats(userId: string): Promise<Chat[]> {
        try {
            const response = await chatHttpClient.get(`/chat/user/${userId}`);
            console.log("get user chat:", response.data)
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 403) {
                throw new Error(`No chats found: ${error.response.data.error || "Forbidden"}`);
            }
            throw error;
        }
    }

    async getUnreadChatCount(userId: string): Promise<number> {
        try {
            const response = await fetch(`http://localhost:5001/notifications/unread?user_id=${userId}`, {
                headers: { Authorization: `Bearer ${useAuthStore.getState().token}` },
            });
            const { chat } = await response.json();
            return chat;
        } catch (error) {
            console.error("Error fetching unread chat count:", error);
            return 0;
        }
    }
}

export default new ChatService();