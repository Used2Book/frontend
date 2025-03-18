import { Post } from "@/types/post";
export const mockPosts: Post[] = [
    {
        id: 1,
        user_id: 1,
        content: "Hello therek",
        created_at: "2024-01-01T00:00:00Z", // ✅ Ensure this exists
    },
    {
        id: 2,
        user_id: 1,
        content: "Hello there",
        created_at: "2024-01-01T00:00:00Z", // ✅ Ensure this exists
    },
]