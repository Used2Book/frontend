export interface MyOrder {
    listing_id: number;
    book_title: string;
    price: number;
    transaction_time: string;
    image_url: string;
  
    buyer_id: number;
    buyer_first_name: string;
    buyer_last_name: string;
    buyer_phone: string;
    buyer_address: string;
    buyer_profile_image: string;
  
    book_id: number;
  }