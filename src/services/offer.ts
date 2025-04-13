import { httpClient } from "@/lib/http-client";
import { toast } from "react-hot-toast";
import { io, Socket } from "socket.io-client";
import useAuthStore from "@/contexts/auth-store";


const NOTIFICATION_SOCKET_URL = "http://localhost:5001";


class offerService {
    private notiSocket: Socket | null = null;

    connect(): Socket {
        const userId = useAuthStore.getState().user?.id;
        const isAdmin = useAuthStore.getState().user?.role === "admin";
        if (!userId) throw new Error("No user ID available");
        console.log("Connecting with user ID:", userId);

        if (!this.notiSocket) {
            this.notiSocket = io(NOTIFICATION_SOCKET_URL, {
                query: { user_id: userId, isAdmin: isAdmin },
                transports: ["websocket"],
            });

            this.notiSocket.on("connect", () => {
                console.log("Connected to notification service:", this.notiSocket?.id);
                this.getUnreadOfferCount(userId.toString()); // Fetch initial count
            });

            this.notiSocket.on("connect_error", (error: Error) => {
                console.error("Notification connection error:", error.message);
            });
        }

        return this.notiSocket;
    }

    onOfferCount(callback: (counts: { offers: number }) => void): void {
        this.notiSocket?.on("unread_offer_count", callback);
    }

    

    async getUnreadOfferCount(userId: string): Promise<number> {
        try {
            const response = await fetch(`http://localhost:5001/notifications/unread-offers?user_id=${userId}`, {
                headers: { Authorization: `Bearer ${useAuthStore.getState().token}` },
            });
            const { offers } = await response.json();
            return offers;
        } catch (error) {
            console.error("Error fetching unread offers count:", error);
            return 0;
        }
    }

    async updateReadOffer(userId: string){
        try {
            const response = await fetch(`http://localhost:5001/notifications/mark-offer-read`, {
                method: "POST",
                headers: { Authorization: `Bearer ${useAuthStore.getState().token}` },
                body: JSON.stringify({ user_id: userId })
            });
            const data = await response.json();
            console.log("Update read offer:", data)
        } catch (error) {
            console.error("Error fetching unread offer count:", error);
        }
    }

    disconnect(): void {
        if (this.notiSocket) {
            this.notiSocket.disconnect();
            this.notiSocket = null;
        }
    }
}

export default new offerService();

export async function addOffer(listingId: number, offeredPrice: number) {
    try {
        console.log("listingId:", listingId, "offeredPrice:", offeredPrice);
        const res = await httpClient.post("/user/offers", {
            listingId: listingId,
            offeredPrice: offeredPrice
        });
        console.log("res offer:", res);
        return res.data;
    } catch (error) {
        console.error("Error adding offer:", error);
        toast.error("error : " + error);
    }
}

export async function getBuyerOffers() {
    try {
        const res = await httpClient.get("/user/offers/buyer");
        console.log("res offers:", res.data.offers);
        return res.data.offers;
    } catch (error) {
        console.error("Error fetching buyer offers:", error);
        throw error;
    }
}

export async function getSellerOffers() {
    try {
        const res = await httpClient.get("/user/offers/seller");
        console.log("res offers:", res.data.offers);
        return res.data.offers;
    } catch (error) {
        console.error("Error fetching seller offers:", error);
        throw error;
    }
}

export async function removeOffer(listingId: number) {
    try {
        const res = await httpClient.post("/user/offers-rm", { listingId: listingId });
        console.log("res offer:", res);
        return res.data;
    } catch (error) {
        console.error("Error removing offer:", error);
        toast.error("error : " + error);
    }
}

export async function acceptOffer(offerId: number) {
    try {
      const res = await httpClient.post("/user/offers/accept", { offerId });
      return res.data;
    } catch (error) {
      console.error("Error accepting offer:", error);
      throw error;
    }
  }
  
  export async function rejectOffer(offerId: number) {
    try {
      const res = await httpClient.post("/user/offers/reject", { offerId });
      return res.data;
    } catch (error) {
      console.error("Error rejecting offer:", error);
      throw error;
    }
  }

  export async function getAcceptedOffer(offerId: number) {
    try {
      const res = await httpClient.get(`/user/offers/${offerId}/payment`);
      return res.data.offer;
    } catch (error) {
      console.error("Error fetching accepted offer:", error);
      throw error;
    }
  }