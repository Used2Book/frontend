import { httpClient } from "@/lib/http-client";
// src/services/notification.ts
import { io, Socket } from "socket.io-client";
import useAuthStore from "@/contexts/auth-store";
import { loadStripe } from '@stripe/stripe-js';
import axios from "axios";
import toast from "react-hot-toast";
import { Notification } from "@/types/notification";

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

    onPaymentList(callback: (payment_lists: {lists: Notification[]}) => void): void {
        this.notiSocket?.on("payment_list", callback);
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

    async getPaymentList(userId: string): Promise<Notification[]> {
        try {
            const response = await fetch(`http://localhost:5001/notifications/all-payments?user_id=${userId}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${useAuthStore.getState().token}` },
            });
            const data = await response.json();
            return data.lists;
        } catch (error) {
            console.error("Error fetching unread payment count:", error);
            return [];
        }
    }

    async updateReadPayment(userId: string){
        try {
            const response = await fetch(`http://localhost:5001/notifications/mark-payment-read`, {
                method: "POST",
                headers: { Authorization: `Bearer ${useAuthStore.getState().token}` },
                body: JSON.stringify({ user_id: userId })
            });
            const data = await response.json();
            console.log("Update read payment:", data)
        } catch (error) {
            console.error("Error fetching unread payment count:", error);
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




export const checkout = async (listingId: number, buyerId: number, offerId?: number) => {
    try {
        console.log("Fetching charge...");
        console.log("listingId:", listingId, "buyerId:", buyerId, "offerId:", offerId);

        const res = await httpClient.post("/payment/check-out", {
            listing_id: listingId,
            buyer_id: buyerId,
            offer_id: offerId, // Optional
        });

        console.log("charge data:", res.data);
        const stripe = await loadStripe("pk_test_51R9WTyEA0LxvmLp3Hm8XqTjlsEfaLFAB99gvl0YKPWpk3Ql89zEEotwQPdks8YjhWxiAPrDcrE5eSCFrkupw4HHe00rNfITV80");

        if (!stripe) {
            console.error("Stripe failed to load");
            return;
        }

        await stripe.redirectToCheckout({ sessionId: res.data.session_id });

    } catch (err) {
        // Axios-style error handling
        if (axios.isAxiosError(err)) {
            const status = err.response?.status;
            const message = err.response?.data?.message || err.message;

            // console.error(`HTTP error ${status}: ${message}`);

            if (status === 500) {
                toast.error("⚠️ This item currently reserved. Please try again later.");
            } else if (status === 400) {
                toast.error("❌ Invalid request. Please check the form and try again.");
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        } else {
            console.error("Unknown error:", err);
            toast.error("Unexpected error occurred.");
        }

        return null;
    }
};
