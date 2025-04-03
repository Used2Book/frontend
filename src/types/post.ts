// src/types/post.ts
export interface Post {
  id: number;
  user_id: number;
  content: string;
  genre_id?: number | null;
  book_id?: number | null;
  created_at: string;
  updated_at: string;
  image_urls?: string[]; // For PostCard compatibility
}