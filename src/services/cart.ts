import { httpClient} from "@/lib/http-client";
import { toast } from "react-hot-toast";

export async function addCart(listingId: number) {
    try {
        console.log("listingId:", listingId)
        const res = await httpClient.post("/user/cart", { listingId: listingId });

        console.log("res add cart:", res)
        return res.data
    } catch (error) {
        console.error("Error adding listing to cart:", error);
        toast.error("error : " + error)
    }
};

export async function getCart() {
    try {
        const res = await httpClient.get("/user/cart");
        console.log("res carts:", res.data.carts)
        return res.data.carts
    } catch (error) {
        console.error("Error getting listing to cart:", error);
        toast.error("error : " + error)
    }
};

export async function removeCart(listingId: number) {
    try {
        const res = await httpClient.post("/user/cart-rm", { listingId: listingId });
        console.log("res gender:", res)
        return res.data
    } catch (error) {
        console.error("Error remove listing to cart:", error);
        toast.error("error : " + error)
    }
};








