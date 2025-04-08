"use client";
import PostCard from "@/app/user/components/post-card";
import { Post } from "@/types/post";
import { useState, useEffect } from "react";
import Avatar from "@/components/avatar";
import useAuthStore from "@/contexts/auth-store";
import { ImagePlus, Loader2, Search } from "lucide-react";
import { uploadPostImages, createPost, getAllPosts } from "@/services/webboard";
import { getAllGenres } from "@/services/book";
import { allBooks } from "@/services/book";
import { getAllUsers } from "@/services/user";
import Image from "next/image";
import Link from "next/link";
import star_png from '@/assets/images/star.png';
import { Book } from "@/types/book";

export default function WebBoardPage() {
  const user = useAuthStore((state) => state.user);
  const [postList, setPostList] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postText, setPostText] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<{ id: number; first_name: string; last_name: string; picture_profile?: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<{ type: "book" | "genre" | "user"; id: number } | null>(null);
  const [activeTab, setActiveTab] = useState<"book" | "genre" | "user">("book");

  useEffect(() => {
    const fetchData = async () => {
      const [posts, fetchedGenres, fetchedBooks, fetchedUsers] = await Promise.all([
        getAllPosts(),
        getAllGenres(),
        allBooks(),
        getAllUsers(),
      ]);
      setPostList(posts);
      setGenres(fetchedGenres);
      setBooks(fetchedBooks);
      setUsers(fetchedUsers);
    };
    fetchData();
  }, []);

  const handlePostSubmit = async () => {
    if (!user) {
      alert("Please log in to submit a post.");
      return;
    }

    setIsLoading(true);
    try {
      let imageUrls: string[] = [];
      if (images.length > 0) {
        imageUrls = await uploadPostImages(images);
      }
      const genreId = selectedItem?.type === "genre" ? selectedItem.id : null;
      const bookId = selectedItem?.type === "book" ? selectedItem.id : null;
      const newPost = await createPost(postText, imageUrls, genreId, bookId);
      setPostList((prev) => [newPost, ...prev]);
      setPostText("");
      setImages([]);
      setPreviewImages([]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("Failed to submit post.");
    } finally {
      setIsLoading(false);
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

  const filteredItems = activeTab === "book"
    ? books
      .map((book) => ({
        type: "book" as const,
        id: book.id,
        label: book.title,
        image: book.cover_image_url,
        author: book.author,
        description: book.description,
        num_ratings: book.num_ratings,
        average_rating: book.average_rating,
      }))
      .filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : activeTab === "genre"
      ? genres
        .map((genre) => ({
          type: "genre" as const,
          id: genre.id,
          label: genre.name,
          image: null,
        }))
        .filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
      : users
        .map((user) => ({
          type: "user" as const,
          id: user.id,
          label: `${user.first_name} ${user.last_name}`,
          image: user.picture_profile || null,
        }))
        .filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()));

  const filteredPosts = selectedItem
    ? postList.filter((post) =>
      selectedItem.type === "book"
        ? post.book_id === selectedItem.id
        : selectedItem.type === "genre"
          ? post.genre_id === selectedItem.id
          : post.user_id === selectedItem.id
    )
    : postList;

  const selectedBook = selectedItem?.type === "book" ? books.find((b) => b.id === selectedItem.id) : null;
  const selectedGenre = selectedItem?.type === "genre" ? genres.find((g) => g.id === selectedItem.id) : null;
  const selectedUser = selectedItem?.type === "user" ? users.find((u) => u.id === selectedItem.id) : null;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-8 md:px-16 lg:px-24">
      <h1 className="text-xl sm:text-2xl font-bold mb-10">WebBoard</h1>
      {/* Tabbed Search and Add Button */}
      <div className="flex justify-start mb-6 space-x-16">
        <div className="flex-1 flex-col">
          <div className="flex space-x-5 mb-4 ">
            <button
              className={`flex py-2 px-10 text-sm font-semibold ${activeTab === "book" ? "bg-blue-200 text-blue-900 rounded-md" : "text-gray-500"}`}
              onClick={() => {
                setActiveTab("book");
                setSearchQuery("");
                setSelectedItem(null);
              }}
            >
              Books
            </button>
            <button
              className={`flex py-2 px-10 text-sm font-semibold ${activeTab === "genre" ? "bg-blue-200 text-blue-900 rounded-md" : "text-gray-500"}`}
              onClick={() => {
                setActiveTab("genre");
                setSearchQuery("");
                setSelectedItem(null);
              }}
            >
              Genres
            </button>
            <button
              className={`flex py-2 px-10 text-sm font-semibold ${activeTab === "user" ? "bg-blue-200 text-blue-900 rounded-md" : "text-gray-500"}`}
              onClick={() => {
                setActiveTab("user");
                setSearchQuery("");
                setSelectedItem(null);
              }}
            >
              Users
            </button>
          </div>
          <label className="block text-sm font-medium mb-2">
            Search {activeTab === "book" ? "Books" : activeTab === "genre" ? "Genres" : "Users"}
          </label>
          <div className="relative w-full mb-5">
            <input
              type="text"
              placeholder={`  Search ${activeTab === "book" ? "books" : activeTab === "genre" ? "genres" : "users"}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 pr-10 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" size={20} />
            {searchQuery && filteredItems.length > 0 && (
              <ul className="absolute w-full top-full mt-1 border bg-white rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {filteredItems.map((item) => (
                  <li
                    key={`${item.type}-${item.id}`}
                    className="px-4 py-2 px-5 hover:bg-gray-100 cursor-pointer flex space-x-3 items-center"
                  >
                    {item.type === "user" ? (
                      <Link href={`/user/${item.id}`} passHref>
                        <div className="flex space-x-3 items-center w-full">
                          {item.image && (
                            <div className="relative w-12 h-12">
                              <Image
                                alt="User profile"
                                src={item.image}
                                fill
                                objectFit="cover"
                                className="rounded-full border border-zinc-300 shadow-md"
                              />
                            </div>
                          )}
                          <div className="flex flex-col">
                            <p className="text-xs font-semibold text-black truncate">
                              {item.label.length > 50 ? `${item.label.slice(0, 50)}...` : item.label}
                            </p>
                            <p className="text-xxs capitalize">{item.type}</p>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <div
                        className="flex space-x-3 items-center w-full"
                        onClick={() => {
                          setSelectedItem({ type: item.type, id: item.id });
                          setSearchQuery("");
                        }}
                      >
                        {item.type === "book" && item.image && (
                          <div className="relative w-12 h-16">
                            <Image
                              alt="Book cover"
                              src={item.image}
                              fill
                              objectFit="cover"
                              className="rounded-sm border border-zinc-300 shadow-md"
                            />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <p className="text-xs font-semibold text-black truncate">
                            {item.label.length > 50 ? `${item.label.slice(0, 50)}...` : item.label}
                          </p>
                          <p className="text-xxs capitalize">{item.type}</p>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Two-Column Layout remains outside */}
          {/* Two-Column Layout */}
          <div className="max-w-4xl mx-auto flex flex-col gap-6">
            {/* Left Side: Selected Item */}
            {selectedItem && selectedItem.type !== "user" && (
              <div className="flex flex-col items-center">
                {selectedItem.type === "book" && selectedBook ? (
                  <div className="flex flex-col w-full md:flex-row py-10 px-5 border-b-2 border-gray-200">
                    <div className="w-10 sm:w-10 md:w-16 lg:w-20 mr-5">
                      <div className="relative h-16 sm:h-20 md:h-24 lg:h-28">
                        <Image
                          alt="Book cover"
                          src={selectedBook.cover_image_url}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="100%"
                          className="rounded-sm border border-zinc-300"
                        />
                      </div>
                    </div>

                    <div className="flex-1 flex-col justify-start space-y-2 text-sm">
                      <p className="text-sm font-bold">{selectedBook.title}</p>
                      <p className='text-xs text-gray-600'>
                        <ul className="flex space-x-2">
                          {selectedBook?.author.map((author: any, index: any) => (
                            <li
                              key={index}
                              className="inline-block whitespace-nowrap"
                            >
                              {author}
                            </li>
                          ))}
                        </ul>
                      </p>
                      <div className="flex space-x-2 items-center text-xs">
                        <Image src={star_png} alt="rating" width={15} height={15} />
                        <p>{selectedBook.average_rating}</p>
                        <p className="text-zinc-400">({selectedBook.num_ratings})</p>
                      </div>
                      <p className="line-clamp-3">{selectedBook.description}</p>
                    </div>
                  </div>
                ) : (
                  <h2 className="text-base font-semibold text-center border border-gray-200 shadow-md rounded-md p-5">{selectedGenre?.name}</h2>
                )}
                {selectedItem && selectedItem.type !== "user" && (
                  <div className="flex w-full justify-end items-end">
                    <button
                      className="mt-4 mr-8 px-5 py-1 bg-black text-white text-xs sm:text-sm shadow-md rounded-lg hover:bg-gray-800 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                      onClick={() => setIsModalOpen(true)}
                    >
                      + Add Post
                      {/* {selectedItem.type === "book" ? selectedBook?.title : selectedGenre?.name} */}
                    </button>
                  </div>
                )}
              </div>
            )}
            {/* Right Side: Posts */}
            <div className="flex-1 flex flex-col space-y-5">
              {selectedItem?.type === "user" && selectedUser ? (
                <div className="text-center">
                  <p className="text-gray-500">
                    Viewing posts by{" "}
                    <Link href={`/user/${selectedUser.id}`} className="text-blue-500 hover:underline">
                      {selectedUser.first_name} {selectedUser.last_name}
                    </Link>
                  </p>
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => <PostCard key={post.id} postDetail={post} books={books} genres={genres} />)
                  ) : (
                    <p className="text-gray-500 my-10">No posts-1 found for this user.</p>
                  )}
                </div>
              ) : filteredPosts.length > 0 ? (
                filteredPosts.map((post) => <PostCard key={post.id} postDetail={post} books={books} genres={genres} />)
              ) : (
                <p className="text-gray-500 text-center my-10">post not found ...</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-xs bg-green-300">
          <p className="font-semibold">Recommended Book</p>
        </div>
      </div>


      {/* Post Creation Modal */}
      {isModalOpen && selectedItem && selectedItem.type !== "user" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-4 sm:p-8 rounded-lg w-full max-w-lg sm:max-w-xl md:max-w-2xl">
            <div className="pt-4 pb-4 sm:pt-8">
              <div className="flex space-x-4 mb-2">
                <Avatar user={user} />
                <div className="flex flex-col justify-center space-y-1">
                  <span className="text-sm sm:text-base font-semibold">
                    {user?.first_name} {user?.last_name}
                  </span>
                  <span className="text-xs text-gray-500">
                    Posting about{" "}
                    {selectedItem.type === "book" ? selectedBook?.title : selectedGenre?.name}
                  </span>
                </div>
              </div>
            </div>
            <textarea
              className="w-full p-2 border rounded-md mb-4 text-sm sm:text-base"
              rows={4}
              placeholder="Write down something..."
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
            />
            <div>
              <div className="flex overflow-x-auto gap-2 mt-2 pb-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {previewImages.map((src, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-20 h-24 sm:w-24 sm:h-32 border rounded-lg overflow-hidden snap-start relative"
                  >
                    <img src={src} alt="Post Image" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1 hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <label className="flex-shrink-0 w-20 h-24 sm:w-24 sm:h-32 border border-gray-300 rounded-lg flex justify-center items-center cursor-pointer bg-gray-100 hover:bg-gray-200">
                  <ImagePlus size={20} color="gray" />
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
            <div className="flex justify-end space-x-3 mt-4">
              <button
                className="px-3 py-2 sm:px-4 bg-gray-300 rounded-md text-sm sm:text-base hover:bg-gray-400"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-2 sm:px-4 bg-blue-500 text-white rounded-md text-sm sm:text-base hover:bg-blue-600"
                onClick={handlePostSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Loading Popup */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-sm text-gray-600">Saving your post...</p>
          </div>
        </div>
      )}
    </div>
  );
}