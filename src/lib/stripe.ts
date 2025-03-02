// lib/stripe.ts
import { loadStripe } from "@stripe/stripe-js";

// Use a public environment variable (e.g., NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

// Export the promise directly
export const stripePromise = loadStripe(publishableKey);
