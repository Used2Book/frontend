import { Review } from "@/types/review";
export const mockReviews: Review[] = [
    {
        id: 1,
        username: "Alice",
        rating: 4.5,
        sellerNote: "Amazing book!",
        likes: 10,
        datePosted: "2024-01-01T00:00:00Z", // ✅ Ensure this exists
    },
    {
        id: 2,
        username: "Bob",
        rating: 3.8,
        sellerNote: "Good, but a bit expensive.",
        likes: 5,
        datePosted: "2024-01-02T00:00:00Z", // ✅ Ensure this exists
    },
    {
        id: 3,
        username: "Alice",
        rating: 4.5,
        sellerNote: "Amazing book!",
        likes: 10,
        datePosted: "2024-01-01T00:00:00Z", // ✅ Ensure this exists
    },
    {
        id: 4,
        username: "Bob",
        rating: 3.8,
        sellerNote: "Good, but a bit expensive.",
        likes: 5,
        datePosted: "2024-01-02T00:00:00Z", // ✅ Ensure this exists
    },
];
