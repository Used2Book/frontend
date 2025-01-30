export interface User {
    id: number; // Primary key, auto-incremented
    email: string; // User's email, unique
    verifiedEmail: boolean; // Indicates if the email is verified
    name: string; // Optional user's name
    picture: string; // Optional profile picture URL
    picture_background: string; // Optional profile picture URL
    role: "user" | "admin"; // Role of the user, default is 'user'
    createdAt: Date; // Timestamp when the user was created
    updatedAt: Date; // Timestamp when the user was last updated
}
