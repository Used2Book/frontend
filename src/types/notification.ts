export interface Notification {
    _id: string;
    user_id: number;
    buyer_id?: number;
    seller_id?: number;
    listing_id?: number;
    type: string;
    message: string;
    related_id: string;
    chatId?: string;
    read: boolean;
    created_at: string;
}
export interface NotiBox {
    _id: string;

    seller_id: string;

    buyer_img: string;
    buyer_name: string;

    book_name: string;
    book_img_url: string;

    create_at: string;
}

