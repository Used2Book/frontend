"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { allBooks } from "@/services/book";
import { userAddLibrary } from "@/services/user";
import toast from "react-hot-toast";
import { getMe } from "@/services/user";
import { useRouter } from "next/navigation";
import useAuthStore from "@/contexts/auth-store";

const Label = ({ label }: { label: string }) => (
    <label className="block text-base font-medium mb-2">{label}</label>
);

export default function AddLibraryBookPage() {
    const router = useRouter();
    const setUser = useAuthStore((state) => state.setUser);

    const [title, setTitle] = useState("");
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [bookID, setBookID] = useState<number | null>(null);
    const [readingStatus, setReadingStatus] = useState<number>(1); // Default to "Finished Reading" (1)
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchBooks = async () => {
            const books = await allBooks();
            setBooks(books);
        };
        fetchBooks();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        if (!bookID) {
            toast.error("Please select a book");
            setIsSubmitting(false);
            return;
        }

        try {
            await userAddLibrary({
                book_id: bookID,
                reading_status: readingStatus, // Use the selected reading status (0 or 1)
            });

            toast.success("Add Book to Library Successfully!");
            setTimeout(async () => {
                const updatedUser = await getMe();
                if (updatedUser) {
                    setUser(updatedUser);
                    router.push("/user/profile");
                }
                setIsSubmitting(false);
            }, 1000);
        } catch (error) {
            toast.error("Failed to Add Book");
            setIsSubmitting(false);
        }
    };

    const filteredBooks = books.filter((book) =>
        book?.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-xl mx-48 my-5 p-6">
            <h2 className="text-2xl font-bold mb-6">Add to My Reads</h2>
            <form onSubmit={handleSubmit} className="space-y-10">
                <div>
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
                        <ul className="absolute w-1/2 mt-1 border bg-white rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                            {filteredBooks.map((book) => (
                                <li
                                    key={book?.id}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex space-x-3 items-center"
                                    onClick={() => {
                                        setTitle(book?.title);
                                        setSearchQuery("");
                                        setBookID(book?.id);
                                    }}
                                >
                                    <div className="relative w-12 h-16">
                                        <Image
                                            alt="Book cover"
                                            src={book?.cover_image_url}
                                            fill
                                            objectFit="cover"
                                            className="rounded-sm border border-zinc-300 shadow-md"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-xs font-semibold text-black truncate">
                                            {book?.title.length > 50 ? `${book?.title.slice(0, 50)}...` : book?.title}
                                        </p>
                                        <p className="text-xxs">by {book?.author}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Reading Status Radio Buttons */}
                <div>
                    <Label label="Reading Status" />
                    <div className="flex space-x-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="readingStatus"
                                value={0}
                                checked={readingStatus === 0}
                                onChange={() => setReadingStatus(0)}
                                className="form-radio text-blue-500"
                            />
                            <span>Currently Reading</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="readingStatus"
                                value={1}
                                checked={readingStatus === 1}
                                onChange={() => setReadingStatus(1)}
                                className="form-radio text-blue-500"
                            />
                            <span>Finished Reading</span>
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    className={`w-1/4 py-2 rounded-xl transition shadow-xl ${
                        isSubmitting
                            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                            : "bg-black text-white hover:bg-zinc-700"
                    }`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Adding..." : "Add"}
                </button>
            </form>
        </div>
    );
}