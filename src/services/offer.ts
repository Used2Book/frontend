import { httpClient } from "@/lib/http-client";
import { toast } from "react-hot-toast";

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