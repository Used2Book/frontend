export interface Cart {
    id: number;
    user_id: number;
    seller_id: number;
    listing_id: number;
    book_id: number;
    price?: number;
    allow_offers?: boolean;
    book_title: string;
    book_author: string[];
    cover_image_url: string;
    image_url: string;
    status: string;
  }

