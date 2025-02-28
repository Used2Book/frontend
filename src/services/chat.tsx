// src/services/chatService.tsx
import { io, Socket } from "socket.io-client";
import chatHttpClient from "@/lib/chat-http-client"; // Use your existing Axios instance
import useAuthStore from "@/contexts/auth-store";
import { Chat, Message } from "@/types/chat";

const SOCKET_URL = "http://localhost:5000"; // Adjust if different

class ChatService {
    private socket: Socket | null = null;

    connect(): Socket {
        const token = useAuthStore.getState().token;
        if (!token) throw new Error("No authentication token available");

        this.socket = io(SOCKET_URL, {
            auth: { token },
            transports: ["websocket"],
        });

        this.socket.on("connect", () => {
            console.log("Connected to chat service:", this.socket?.id);
        });

        this.socket.on("connect_error", (error: Error) => {
            console.error("Connection error:", error.message);
        });

        return this.socket;
    }

    onMessage(callback: (message: Message) => void): void {
        this.socket?.on("receiveMessage", callback);
    }

    onSent(callback: (message: Message) => void): void {
        this.socket?.on("messageSent", callback);
    }

    onError(callback: (error: string) => void): void {
        this.socket?.on("error", callback);
    }

    sendMessage(receiverId: string, content: string, chatId: string): void {
        this.socket?.emit("sendMessage", { receiverId, content, chatId });
    }

    disconnect(): void {
        if (this.socket) this.socket.disconnect();
    }

    async getChatMessages(chatId: string): Promise<Message[]> {
        if (!chatId.includes("-")) {
            console.log("chat id :",chatId)
            throw new Error("Invalid chatId format. Expected user1-user2.");
        }
        try {
            const response = await chatHttpClient.get(`/chat/${chatId}`);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 403) {
                console.error("403 Forbidden: Unauthorized access to chat -", error.response.data.error);
                throw new Error(`Unauthorized access: ${error.response.data.error || "Forbidden"}`);
            }
            console.error("Error fetching messages:", error.message);
            throw error;
        }
    }

    async getUserChats(userId: string): Promise<Chat[]> {
        console.log("Fetching chats for userId:", userId);
        try {
            const response = await chatHttpClient.get(`/chat/user/${userId}`);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 403) {
                console.error("403 Forbidden: No chats found for user -", error.response.data.error);
                throw new Error(`No chats found: ${error.response.data.error || "Forbidden"}`);
            }
            console.error("Error fetching chats:", error.message);
            throw error;
        }
    }
}

export default new ChatService();