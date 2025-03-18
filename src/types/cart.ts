export interface Cart {
    id: number;
    user_id: number;
    seller_id: number;
    listing_id: number;
    book_id: number;
    price?: number;
    allow_offers?: boolean;
    title: string;
    author: string;
    cover_image_url: string;
  }