"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { allBooks } from "@/services/book";
import { userAddLibrary } from "@/services/user";
import toast from "react-hot-toast";
import { getMe } from "@/services/user";
import { useRouter } from "next/navigation";
import useAuthStore from "@/contexts/auth-store";
import RequireSeller from "@/components/require-seller";

const Label = ({ label }: { label: string }) => (
    <label className="block text-base font-medium mb-2">{label}</label>
);

export default function AddBookPage() {
    const router = useRouter();
    const setUser = useAuthStore((state) => state.setUser);

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [genre, setGenre] = useState("");
    const [price, setPrice] = useState<number>(0);
    const [note, setNote] = useState<string>("");
    const [books, setBooks] = useState([]);
    const [isOwned, setIsOwned] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [bookID, setBookID] = useState<number | null>(null);
    const [allowOffers, setAllowOffers] = useState<boolean>(false);
    const [images, setImages] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);

    useEffect(() => {
        const fetchBooks = async () => {
            const books = await allBooks();
            setBooks(books);
        };
        fetchBooks();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!bookID) {
            toast.error("Please select a book");
            return;
        }
        try {
            await userAddLibrary({
                book_id: bookID,
                status: isOwned ? "owned" : "not_own",
                price: isOwned ? price : 0,
                allow_offers: allowOffers,
                seller_note: note,
            }, images);

            toast.success("Add Book to Library Successfully!");
            setTimeout(async () => {
                const updatedUser = await getMe();
                if (updatedUser) {
                    setUser(updatedUser);
                    router.push("/user/profile");
                }
            }, 1000);
        } catch (error) {
            toast.error("Failed to Add Book");
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const selectedFiles = Array.from(e.target.files);
        setImages((prevImages) => [...prevImages, ...selectedFiles]);
        const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
        setPreviewImages((prevPreviews) => [...prevPreviews, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
        setPreviewImages((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    };

    const filteredBooks = books.filter((book) =>
        book?.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <RequireSeller>
            <div className="max-w-xl mx-48 my-5 p-6">
                <h2 className="text-2xl font-bold mb-6">Add to My Reads</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    <div>
                        <Label label="Ownership" />
                        <select
                            className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                            value={isOwned ? "owned" : "not_owned"}
                            onChange={(e) => {
                                setIsOwned(e.target.value === "owned");
                                setImages([]);
                                setPreviewImages([]);
                            }}
                        >
                            <option value="not_owned">Not Owned</option>
                            <option value="owned">Owned</option>
                        </select>
                    </div>
                    {isOwned && (
                        <>
                            <div>
                                <Label label="Book Photos" />
                                <div className="grid grid-cols-5 gap-2 mt-2">
                                    {previewImages.map((src, index) => (
                                        <div key={index} className="relative w-24 h-32 border rounded-lg overflow-hidden">
                                            <img src={src} alt="Book Cover" className="w-full h-full object-cover" />
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
                                            accept="image/*"
                                        />
                                    </label>
                                </div>
                            </div>
                            <div>
                                <Label label="Price ($)" />
                                <input
                                    type="number"
                                    className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                                    value={price}
                                    onChange={(e) => setPrice(Number(e.target.value))}
                                    required
                                />
                            </div>
                            <div className="">
                                <Label label="Note" />
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none h-32 text-lg"
                                    value={note}
                                    placeholder="describe your book ..."
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

                        </>
                    )}
                    <button
                        type="submit"
                        className="w-1/4 bg-black text-white py-2 rounded-xl hover:bg-zinc-700 transition shadow-xl"
                    >
                        Add
                    </button>
                </form>
            </div>
        </RequireSeller>
    );
}