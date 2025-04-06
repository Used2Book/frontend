export interface Offer {
    id: number;
    listing_id: number;
    buyer_id: number;
    offered_price: number;
    initial_price: number;
    status: "pending" | "accepted" | "rejected";
    book_id: number;
    book_title: string;
    book_author: string;
    cover_image_url: string;
    image_url?: string;
    seller_id: number;
    buyer_first_name?: string; 
    buyer_last_name?: string; 
    buyer_picture_profile?: string; 
    avaibility?: string;
  }