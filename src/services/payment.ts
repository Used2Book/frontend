import { httpClient } from "@/lib/http-client";
// src/services/notification.ts
import { io, Socket } from "socket.io-client";
import useAuthStore from "@/contexts/auth-store";

const NOTIFICATION_SOCKET_URL = "http://localhost:5001";

class paymentService {
    private notiSocket: Socket | null = null;

    connect(): Socket {
        const userId = useAuthStore.getState().user?.id;
        if (!userId) throw new Error("No user ID available");
        console.log("Connecting with user ID:", userId);

        if (!this.notiSocket) {
            this.notiSocket = io(NOTIFICATION_SOCKET_URL, {
                query: { user_id: userId },
                transports: ["websocket"],
            });

            this.notiSocket.on("connect", () => {
                console.log("Connected to notification service:", this.notiSocket?.id);
                this.getUnreadPaymentCount(userId.toString()); // Fetch initial count
            });

            this.notiSocket.on("connect_error", (error: Error) => {
                console.error("Notification connection error:", error.message);
            });
        }

        return this.notiSocket;
    }

    onPaymentNotification(callback: (data: { id: string; message: string; related_id: string }) => void): void {
        this.notiSocket?.on("payment_success", (data) => {
            console.log("Payment success event received:", data); // Debug
            callback(data);
        });
    }

    onPaymentCount(callback: (counts: { payments: number }) => void): void {
        this.notiSocket?.on("unread_payment_count", callback);
    }

    async getUnreadPaymentCount(userId: string): Promise<number> {
        try {
            const response = await fetch(`http://localhost:5001/notifications/unread-payments?user_id=${userId}`, {
                headers: { Authorization: `Bearer ${useAuthStore.getState().token}` },
            });
            const { payments } = await response.json();
            return payments;
        } catch (error) {
            console.error("Error fetching unread payment count:", error);
            return 0;
        }
    }

    disconnect(): void {
        if (this.notiSocket) {
            this.notiSocket.disconnect();
            this.notiSocket = null;
        }
    }
}

export default new paymentService();

export async function createOmiseAccount(data: {
  bank_account_number: string;
  bank_account_name: string;
  bank_code: string;
}) {
  try {
    const res = await httpClient.post("/payment/api/omise/create-account", data);
    return res.data;
  } catch (error) {
    console.error("Error creating Omise account:", error);
    throw error;
  }
}
