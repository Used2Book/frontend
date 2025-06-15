"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { allBooks } from "@/services/book";
import { userAddListing } from "@/services/user";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import RequireSeller from "@/components/require-seller";
import { sendOTP, verifyOTP, resendOTP } from "@/services/auth";
import { PhoneInput } from "react-international-phone";
import { PhoneNumberUtil } from "google-libphonenumber";
import "react-international-phone/style.css";
import { SendOTPResponse, VerifyOTPResponse } from "@/types/otp";
import { Book } from "@/types/book";
import OTPModal from "@/app/user/components/otp-modal";

const Label = ({ label }: { label: string }) => (
    <label className="block text-base font-medium mb-2">{label}</label>
);

export default function AddListingBookPage() {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [price, setPrice] = useState<number | "">("");
    const [note, setNote] = useState("");
    const [books, setBooks] = useState<Book[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [bookID, setBookID] = useState<number | null>(null);
    const [allowOffers, setAllowOffers] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [phoneError, setPhoneError] = useState("");

    const phoneUtil = PhoneNumberUtil.getInstance();
    const isPhoneValid = (phone: string) => {
        try {
            return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
        } catch {
            return false;
        }
    };

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const booksData = await allBooks();
                setBooks(booksData);
            } catch (error) {
                console.error("Failed to fetch books:", error);
                toast.error("Failed to load books");
            }
        };
        fetchBooks();
    }, []);

    useEffect(() => {
        return () => {
            previewImages.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [previewImages]);

    const handleAddListing = async () => {
        if (!bookID || price === "" || !phone) {
            throw new Error("Missing required fields");
        }
        try {
            await userAddListing(
                {
                    book_id: bookID,
                    price: Number(price),
                    allow_offers: allowOffers,
                    seller_note: note,
                    phone_number: phone,
                },
                images
            );
        } catch (error: any) {
            throw new Error(error.message || "Failed to add listing");
        }
    };

    const handleSendOTP = async () => {
        if (!phone) {
            setPhoneError("Phone number is required");
            return false;
        }
        if (!isPhoneValid(phone)) {
            setPhoneError("Invalid phone number");
            return false;
        }
        try {
            const res: SendOTPResponse = await sendOTP(phone);
            if (res.success) {
                setModalOpen(true);
                setStatusMessage(res.message || "OTP sent successfully");
                setPhoneError("");
                return true;
            } else {
                setStatusMessage(res.message || "Failed to send OTP");
                return false;
            }
        } catch (error: any) {
            setStatusMessage(`Error: ${error.message}`);
            return false;
        }
    };

    const handleVerifyOTP = async () => {
        try {
            const res: VerifyOTPResponse = await verifyOTP(phone, otp);
            if (res.success) {
                await handleAddListing();
                toast.success("Book added successfully!");
                setModalOpen(false);
                router.push("/user/sale");
            } else {
                setStatusMessage(res.message || "Invalid OTP");
            }
        } catch (error: any) {
            setStatusMessage(error.message || "Failed to verify OTP");
        }
    };

    const handleResendOTP = async () => {
        try {
            const res: SendOTPResponse = await resendOTP(phone);
            setStatusMessage(res.message || "OTP resent successfully");
        } catch (error: any) {
            setStatusMessage(`Error: ${error.message}`);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        if (!bookID) {
            toast.error("Please select a book");
            setIsSubmitting(false);
            return;
        }
        if (price === "" || Number(price) <= 0) {
            toast.error("Please enter a valid price");
            setIsSubmitting(false);
            return;
        }
        const otpSent = await handleSendOTP();
        if (!otpSent) {
            setIsSubmitting(false);
        }

        // No navigation or user update here; wait for OTP verification
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const selectedFiles = Array.from(e.target.files);
        if (images.length + selectedFiles.length > 6) {
            toast.error("Maximum 6 images allowed");
            return;
        }
        const validFiles = selectedFiles.filter((file) =>
            ["image/jpeg", "image/png"].includes(file.type)
        );
        if (validFiles.length !== selectedFiles.length) {
            toast.error("Only JPEG and PNG images are allowed");
        }
        const newImages = [...images, ...validFiles];
        const newPreviews = validFiles.map((file) => URL.createObjectURL(file));

        setImages(newImages);
        setPreviewImages((prev) => [...prev, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        const removedPreview = previewImages[index];
        const newPreviews = previewImages.filter((_, i) => i !== index);

        setImages(newImages);
        setPreviewImages(newPreviews);
        URL.revokeObjectURL(removedPreview);
    };

    const filteredBooks = books.filter((book) =>
        book?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <RequireSeller>
            <div className="max-w-xl mx-auto my-5 p-6">
                <h2 className="text-2xl font-bold mb-6">Add to My Sales</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <Label label="Book Title" />
                        <input
                            type="text"
                            placeholder="Search or enter book title..."
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                setSearchQuery(e.target.value);
                            }}
                            className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                        />
                        {searchQuery && filteredBooks.length > 0 && (
                            <ul className="absolute w-full mt-1 border bg-white rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                                {filteredBooks.map((book) => (
                                    <li
                                        key={book.id}
                                        className="w-full px-4 py-2 hover:bg-gray-100 cursor-pointer flex space-x-3 items-center"
                                        onClick={() => {
                                            setTitle(book.title);
                                            setSearchQuery("");
                                            setBookID(book.id);
                                        }}
                                    >
                                        <div className="relative w-12 h-16">
                                            <Image
                                                alt="Book cover"
                                                src={book.cover_image_url}
                                                fill
                                                objectFit="cover"
                                                className="rounded-sm border border-zinc-300 shadow-md"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-xs font-semibold text-black truncate">
                                                {book.title.length > 50 ? `${book.title.slice(0, 50)}...` : book.title}
                                            </p>
                                            <p className="text-xxs">by {book.author[0]}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div>
                        <Label label="Book Photos" />
                        <div className="grid grid-cols-5 gap-2 mt-2">
                            {previewImages.map((src, index) => (
                                <div
                                    key={index}
                                    className="relative w-24 h-32 border rounded-lg overflow-hidden"
                                >
                                    <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1 hover:bg-red-600"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                            <label className="w-24 h-32 border border-gray-300 rounded-lg flex justify-center items-center cursor-pointer bg-gray-100 hover:bg-gray-200">
                                <span className="text-2xl text-gray-500">+</span>
                                <input
                                    type="file"
                                    multiple
                                    className="hidden"
                                    onChange={handleImageChange}
                                    accept="image/jpeg,image/png"
                                />
                            </label>
                        </div>
                    </div>

                    <div>
                        <Label label="Price ($)" />
                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                            value={price}
                            onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                            required
                        />
                    </div>

                    <div>
                        <Label label="Note" />
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none h-32 text-lg"
                            value={note}
                            placeholder="Describe your book..."
                            onChange={(e) => setNote(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <Label label="Accept Offers?" />
                        <div className="flex space-x-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="offer"
                                    value="yes"
                                    checked={allowOffers}
                                    onChange={() => setAllowOffers(true)}
                                    className="form-radio text-blue-500"
                                />
                                <span>Yes</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="offer"
                                    value="no"
                                    checked={!allowOffers}
                                    onChange={() => setAllowOffers(false)}
                                    className="form-radio text-blue-500"
                                />
                                <span>No</span>
                            </label>
                        </div>
                    </div>

                    <div className="w-full max-w-md mt-4 mb-3">
                        <Label label="Phone Number" />
                        <PhoneInput
                            defaultCountry="th"
                            value={phone}
                            onChange={(value) => {
                                setPhone(value);
                                setPhoneError("");
                                if (value && !isPhoneValid(value)) {
                                    setPhoneError("please provide valid phone number");
                                }
                            }}
                            prefix="+"
                        />
                        {phoneError && (
                            <div className="mt-2 text-red-500 text-xs">{phoneError}</div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className={`w-full max-w-xs py-2 rounded-xl transition shadow-xl ${isSubmitting
                                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                : "bg-black text-white hover:bg-zinc-700"
                            }`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Adding..." : "Add"}
                    </button>
                </form>
            </div>
            {modalOpen && (
                <OTPModal
                    otp={otp}
                    setOtp={setOtp}
                    onVerify={handleVerifyOTP}
                    onResend={handleResendOTP}
                    onClose={() => {
                        setModalOpen(false);
                        setIsSubmitting(false);
                    }}
                    statusMessage={statusMessage}
                    phone={phone}
                />
            )}
        </RequireSeller>
    );
}