
import { io, Socket } from "socket.io-client";
import useAuthStore from "@/contexts/auth-store";
import { Notification } from "@/types/notification";

const NOTIFICATION_SOCKET_URL = "http://localhost:5001";

class adminService {
    private notiSocket: Socket | null = null;

    connect(): Socket {
        const userId = useAuthStore.getState().user?.id;
        const isAdmin = useAuthStore.getState().user?.role === "admin"
        if (!userId) throw new Error("No user ID available");
        console.log("Connecting with user ID:", userId);

        if (!this.notiSocket) {
            this.notiSocket = io(NOTIFICATION_SOCKET_URL, {
                query: { user_id: userId, isAdmin: isAdmin },
                transports: ["websocket"],
            });

            this.notiSocket.on("connect", () => {
                console.log("Connected to notification service:", this.notiSocket?.id);
                this.getUnreadAdminRequestCount(); // Fetch initial count
            });

            this.notiSocket.on("connect_error", (error: Error) => {
                console.error("Notification connection error:", error.message);
            });
        }

        return this.notiSocket;
    }

    onAdminReqCount(callback: (counts: { admins: number }) => void): void {
        this.notiSocket?.on("unread_request_count", callback);
    }

    onAdminReqList(callback: (admin_request_lists: {lists: Notification[]}) => void): void {
        this.notiSocket?.on("admin_request_list", callback);
    }
    

    async getUnreadAdminRequestCount(): Promise<number> {
        try {
            const response = await fetch("http://localhost:5001/notifications/unread-admin-requests", {
                headers: { Authorization: `Bearer ${useAuthStore.getState().token}` },
            });
            const { counts } = await response.json();
            return counts;
        } catch (error) {
            console.error("Error fetching unread admin req count:", error);
            return 0;
        }
    }

    async getAdminRequestList(): Promise<Notification[]> {
        try {
            const response = await fetch("http://localhost:5001/notifications/all-admin-requests", {
                method: "GET",
                headers: { Authorization: `Bearer ${useAuthStore.getState().token}` },
            });
            const data = await response.json();
            return data.lists;
        } catch (error) {
            console.error("Error fetching unread admin req list:", error);
            return [];
        }
    }

    async updateReadAdminRequest(){
        try {
            const response = await fetch("http://localhost:5001/notifications/mark-admin-request-read", {
                method: "POST",
                headers: { Authorization: `Bearer ${useAuthStore.getState().token}` },
            });
            const data = await response.json();
            console.log("Update read admin request:", data)
        } catch (error) {
            console.error("Error update unread admin request :", error);
        }
    }

    disconnect(): void {
        if (this.notiSocket) {
            this.notiSocket.disconnect();
            this.notiSocket = null;
        }
    }
}

export default new adminService();