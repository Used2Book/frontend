export interface BookListCardProps {
  books: Book[];
}


export interface Book {
  id: number;
  title: string;
  author: string;
  cover_image_url: string;
  rating: number;
  description?: string;
  genres?: string[]; // Array of genres
  accessibility?: boolean; // Indicates if the book is accessible
  offer?: boolean; // Indicates if the book is on offer
  price?: number;
  sellerNote?: string;
  allow_offers?: boolean;
  status?: string;
  seller_id?: number;
}

export interface SaleBook {
  id: number;
  title: string;
  author: string;
  cover_image_url: string;
  rating: number;
  description?: string;
  genres?: string[]; // Array of genres
  accessibility?: boolean; // Indicates if the book is accessible
  offer?: boolean; // Indicates if the book is on offer
  price?: number;
  sellerNote?: string;
  allow_offers?: boolean;
  status?: string;
  seller_id: number;
  book_id?: number;
}


