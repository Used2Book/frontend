export interface Book {
  id: number;
  title: string;
  author: string;
  image: string;
  rating: number;
  description?: string;
  genres?: string[]; // Array of genres
  accessibility?: boolean; // Indicates if the book is accessible
  offer?: boolean; // Indicates if the book is on offer
  price?: number;
  sellerNote?: string;
}
