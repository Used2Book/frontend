// src/app/add-book/page.tsx
"use client";
import { useState, useEffect } from "react";
import { insertBook, getAllGenres } from "@/services/book";
import Image from "next/image";
import { ImagePlus, Loader2, Plus, Trash } from "lucide-react";
import toast from "react-hot-toast";

export default function AddBookPage() {
    const [formData, setFormData] = useState({
        title: "",
        author: [""],
        description: "",
        language: "",
        isbn: "",
        publisher: "",
        publish_date: "",
        genres: [] as string[],
    });
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [genresList, setGenresList] = useState<{ id: number; name: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const genres = await getAllGenres();
                setGenresList(genres);
            } catch (err) {
                console.error("Failed to fetch genres:", err);
                setError("Failed to load genres");
            }
        };
        fetchGenres();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "publish_date" && value) {
            const normalizedValue = value.endsWith(":00") ? value : `${value}:00`;
            setFormData((prev) => ({ ...prev, [name]: normalizedValue }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleAuthorChange = (index: number, value: string) => {
        const newAuthors = [...formData.author];
        newAuthors[index] = value;
        setFormData((prev) => ({ ...prev, author: newAuthors }));
    };

    const addAuthorField = () => {
        setFormData((prev) => ({ ...prev, author: [...prev.author, ""] }));
    };

    const removeAuthorField = (index: number) => {
        const newAuthors = formData.author.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, author: newAuthors }));
    };

    const handleGenreChange = (genreName: string, checked: boolean) => {
        setFormData((prev) => {
            if (checked) {
                return { ...prev, genres: [...prev.genres, genreName] };
            } else {
                return { ...prev, genres: prev.genres.filter((g) => g !== genreName) };
            }
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setCoverImage(file);
        setCoverPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.genres.length === 0) {
            setError("Please select at least one genre");
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const localDate = new Date(formData.publish_date);
            const isoPublishDate = localDate.toISOString();

            const payload = {
                ...formData,
                publish_date: isoPublishDate,
            };

            const bookId = await insertBook(payload, coverImage || undefined);
            toast.success(`Book added successfully! Book ID: ${bookId}`);
            setFormData({
                title: "",
                author: [""],
                description: "",
                language: "",
                isbn: "",
                publisher: "",
                publish_date: "",
                genres: [],
            });
            setCoverImage(null);
            setCoverPreview(null);
        } catch (err: any) {
            console.error("Failed to insert book:", err);
            setError(err.message || "Failed to add book");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-4 sm:p-8 md:p-16 lg:p-24 bg-zinc-100">
            <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center">Add a New Book</h1>
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Title *</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter book title"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Author(s) *</label>
                    {formData.author.map((a, index) => (
                        <div key={index} className="flex space-x-2 mb-2">
                            <input
                                type="text"
                                value={a}
                                onChange={(e) => handleAuthorChange(index, e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                placeholder={`Author ${index + 1}`}
                                required
                            />
                            {formData.author.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeAuthorField(index)}
                                    className="bg-red-500 text-white px-2 rounded hover:bg-red-600"
                                >
                                    <Trash size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addAuthorField}
                        className="text-blue-500 text-sm hover:underline flex items-center space-x-1"
                    >
                        <Plus size={14} /> <span>Add another author</span>
                    </button>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        placeholder="Enter book description"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Language</label>
                    <input
                        type="text"
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., English"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">ISBN</label>
                    <input
                        type="text"
                        name="isbn"
                        value={formData.isbn}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 978-0441172719"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Publisher</label>
                    <input
                        type="text"
                        name="publisher"
                        value={formData.publisher}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Ace"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Publish Date</label>
                    <input
                        type="datetime-local"
                        name="publish_date"
                        value={formData.publish_date}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Genres * (Select at least one)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
                        {genresList.map((genre) => (
                            <label key={genre.id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    value={genre.name}
                                    checked={formData.genres.includes(genre.name)}
                                    onChange={(e) => handleGenreChange(genre.name, e.target.checked)}
                                    className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="text-sm">{genre.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Cover Image</label>
                    <div className="flex items-center space-x-4">
                        {coverPreview && (
                            <div className="relative w-24 h-32 border rounded-md overflow-hidden">
                                <Image
                                    src={coverPreview}
                                    alt="Cover preview"
                                    fill
                                    objectFit="cover"
                                    className="rounded-md"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCoverImage(null);
                                        setCoverPreview(null);
                                    }}
                                    className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1 hover:bg-red-600"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                        <label className="flex items-center justify-center w-24 h-32 border border-gray-300 rounded-md cursor-pointer bg-gray-100 hover:bg-gray-200">
                            <ImagePlus size={20} color="gray" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex justify-end space-x-3">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                    >
                        {isLoading ? "Adding..." : "Add Book"}
                    </button>
                </div>
            </form>

            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg flex flex-col items-center space-y-4">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        <p className="text-sm text-gray-600">Adding your book...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
