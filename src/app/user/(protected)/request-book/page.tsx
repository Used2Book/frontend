"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createBookRequest } from "@/services/user";

const Label = ({ label }: { label: string }) => (
  <label className="block text-sm font-normal mb-2 w-full">
    {label} <span className="text-red-500 text-lg">*</span>
  </label>
);

export default function RequestBook() {
  const [bookTitle, setBookTitle] = useState<string>("");
  const [isbn, setIsbn] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Added loading state
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bookTitle.trim() === "" || isbn.trim() === "") {
      toast.error("Book title and ISBN are required");
      return;
    }

    setIsSubmitting(true);
    try {
      await createBookRequest({ title: bookTitle.trim(), isbn: isbn.trim(), note: note.trim() });
      toast.success("Book request sent successfully!");
      router.push("/user/home");
    } catch (error) {
      toast.error("Failed to send book request: " + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col mx-5 sm:mx-10 md:mx-10 lg:mx-14 my-14 px-6">
      <h2 className="text-xl font-bold mb-6">Request to List New Book</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label label="Book Title" />
          <input
            type="text"
            className="w-full p-2 border text-sm border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <Label label="Book ISBN" />
          <input
            type="text"
            className="w-full p-2 border text-sm border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <Label label="Note" />
          <textarea
            className="w-full p-2 border text-sm border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <button
          type="submit"
          className={`bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}

