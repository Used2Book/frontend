"use client";

import React, { use, useState } from "react";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import { buyListing } from "@/services/user";
import toast from "react-hot-toast";

interface CheckoutFormProps {
  listingId: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ listingId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    // Call your backend service to create a PaymentIntent.
    // Here we assume buyListing returns an object with a property `clientSecret`
    const { clientSecret } = await buyListing(parseInt(listingId));
    if (!clientSecret) {
      toast.error("Could not create payment intent");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setLoading(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      toast.error("Payment failed: " + error.message);
    } else if (paymentIntent?.status === "succeeded") {
      toast.success("Payment succeeded!");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={{ hidePostalCode: true }} />
      <button type="submit" disabled={!stripe || loading} className="bg-black text-white p-3">
        {loading ? "Processing…" : "Pay Now"}
      </button>
    </form>
  );
};

interface PaymentPageProps {
  params: Promise<{ book_listing: string }>;
}

export default function PaymentPage({ params: promisedParams }: PaymentPageProps) {
  // Unwrap the promised parameters using React's use() hook.
  const resolvedParams = use(promisedParams);
  const book_listing = resolvedParams.book_listing;
  const [bookId, listingId] = book_listing.split("_");

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm listingId={listingId} />
    </Elements>
  );
}
