// src/app/user/[id]/book/[book_listing]/payment/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { getListingByID, userProfile, charge } from "@/services/user";
import NoBackGround from "@/assets/images/no-background.jpg";
import NoAvatar from "@/assets/images/no-avatar.png";
import useAuthStore from "@/contexts/auth-store";
import paymentService from "@/services/payment"; // Add this for notifications

// Not in used


export default function PaymentPage({ params }: { params: Promise<{ book_listing: string }> }) {
    const user = useAuthStore((state) => state.user);
    const resolvedParams = React.use(params);
    const book_listing = resolvedParams.book_listing;
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [listing, setListing] = useState<any>(null);
    const [seller, setSeller] = useState<any>(null);
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [expiresAt, setExpiresAt] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [showSuccess, setShowSuccess] = useState(false); // Success overlay
    const [successMessage, setSuccessMessage] = useState<string>(""); // Success message

    const parsedListingId = parseInt(book_listing);

    console.log("book listing:", book_listing)

    // Fetch listing and seller data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                if (!parsedListingId || isNaN(parsedListingId)) {
                    toast.error("Invalid book listing ID.");
                    return;
                }
                const fetchedListing = await getListingByID(parsedListingId);
                console.log("Fetched Listing:", fetchedListing);
                if (!fetchedListing) {
                    toast.error("Listing not found");
                    return;
                }
                if (fetchedListing.status !== "for_sale") {
                    toast.error("This listing is not available for purchase.");
                    return;
                }
                setListing(fetchedListing);

                const sellerProfile = await userProfile(fetchedListing.seller_id);
                console.log("Seller Profile:", sellerProfile);
                setSeller(sellerProfile);
            } catch (err) {
                console.error("Error fetching data:", err);
                toast.error("Error fetching payment details.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Connect to paymentService for real-time updates
        paymentService.connect();
        paymentService.onPaymentNotification((data) => {
            console.log("Payment success received:", data);
            setSuccessMessage(data.message);
            setShowSuccess(true);
            setQrCodeUrl(null);
            setTimeLeft(null);
            setTimeout(() => {
                setShowSuccess(false);
                router.push("/user/cart"); // Redirect to orders page
            }, 2000);
        });

        return () => paymentService.disconnect();
    }, [parsedListingId, router]);

    // Countdown timer for QR code expiration
    useEffect(() => {
        if (expiresAt) {
            const interval = setInterval(() => {
                const remaining = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
                setTimeLeft(remaining);
                if (remaining <= 0) {
                    setQrCodeUrl(null);
                    setTimeLeft(null);
                    toast.error("QR code expired. Please try again.");
                    clearInterval(interval);
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [expiresAt]);

    const handlePayment = async () => {
        setLoading(true);
        try {
            if (!user?.id) {
                toast.error("Please log in to proceed with payment.");
                return;
            }
            const data = await charge(parsedListingId, user.id, 0); // 0 for no offerId
            if (data && data.success) {
                setQrCodeUrl(data.qr_code);
                setExpiresAt(data.expires_at);
                toast.success("Scan the QR code to complete payment!");
            } else {
                throw new Error(data?.message || "Payment initiation failed");
            }
        } catch (err: any) {
            console.error("Payment error:", err);
            toast.error(err.message || "Error initiating payment.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="text-center py-4">Loading...</p>;

    return (
        <div className="relative bg-white mt-10 mx-36 p-6 border border-gray-300 rounded-lg shadow-lg">
            <div className="flex p-10 justify-center">
                <div className="flex space-x-5 w-full">
                    <div className="relative w-8 sm:w-20 md:w-24 lg:w-40 h-24 sm:h-36 md:h-44 lg:h-64">
                        <Image
                            alt="Book cover"
                            src={listing?.cover_image_url || NoBackGround}
                            fill
                            objectFit="cover"
                            className="rounded-sm border border-zinc-300"
                        />
                    </div>
                    <div className="flex flex-col justify-start space-y-3 text-sm p-4">
                        <p className="text-xl font-bold">{listing?.title || "Unknown Title"}</p>
                        <p className="flex space-x-2 items-center text-zinc-400 italic">
                            <ul className="flex space-x-2">
                                {listing?.author.map((author: any, index: any) => (
                                    <li
                                        key={index}
                                        className="inline-block whitespace-nowrap"
                                    >
                                        {author}
                                    </li>
                                ))}
                            </ul>
                        </p>
                        <div className="flex space-x-2 items-center py-2">
                            <div className="flex justify-start w-8 h-8 rounded-full overflow-hidden">
                                <Image
                                    src={seller?.picture_profile || NoAvatar}
                                    alt="Profile"
                                    width={50}
                                    height={50}
                                />
                            </div>
                            <p className="ml-2 text-sm py-1 font-bold">
                                {seller?.first_name} {seller?.last_name}
                            </p>
                        </div>
                        <p className="font-medium text-2xl">
                            {listing?.price ? `฿${listing.price}` : "Not available"}
                        </p>
                    </div>
                </div>

                <div className="w-1/2">
                    <h2 className="text-xl font-bold mb-4 text-center">Pay with PromptPay</h2>
                    {qrCodeUrl ? (
                        <div className="flex flex-col justify-center items-center text-center">
                            <div className="relative w-28 h-48 md:w-32 md:h-52 lg:w-56 lg:h-80 border-[15px] border-white">
                                <Image
                                    src={qrCodeUrl}
                                    alt="QR Code"
                                    fill
                                    objectFit="cover"
                                    className="object-cover"
                                />
                            </div>
                            <p className="mt-2">
                                Scan this QR code with your PromptPay app. Expires at:{" "}
                                {expiresAt && new Date(expiresAt).toLocaleString()}
                            </p>
                            {timeLeft !== null && (
                                <p className="mt-2 text-sm text-gray-600">
                                    Time left: {timeLeft} seconds
                                </p>
                            )}
                            <p className="mt-2 text-sm text-gray-600">
                                After payment, you’ll be redirected to your orders.
                            </p>
                        </div>
                    ) : (
                        <button
                            onClick={handlePayment}
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition"
                            disabled={loading || !listing || listing.status !== "for_sale"}
                        >
                            {loading ? "Processing..." : "Generate QR Code"}
                        </button>
                    )}
                </div>
            </div>

            {/* Success Overlay */}
            {showSuccess && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fade-in">
                    <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md w-full border-4 border-green-500">
                        <div className="flex justify-center mb-4">
                            <svg
                                className="w-16 h-16 text-green-500 animate-bounce"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h2>
                        <p className="text-lg text-gray-700">{successMessage}</p>
                        <p className="mt-4 text-sm text-gray-500">
                            Redirecting to your orders in a moment...
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}