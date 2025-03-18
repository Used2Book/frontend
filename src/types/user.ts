export interface User {
    id?: number; // Primary key, auto-incremented
    email?: string; // User's email, unique
    verifiedEmail?: boolean; // Indicates if the email is verified
    first_name?: string; // Optional user's name
    last_name?: string; // Optional user's name
    phone_number?: string;
    quote?: string;
    bio?: string;
    gender?: string;
    picture_profile?: string; // Optional profile picture URL
    picture_background?: string; // Optional profile picture URL
    role?: "user" | "admin"; // Role of the user, default is 'user'
    createdAt?: Date; // Timestamp when the user was created
    updatedAt?: Date; // Timestamp when the user was last updated
}
