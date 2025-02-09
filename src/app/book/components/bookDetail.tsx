"use client";
import React, { useState, useEffect} from "react";
import Image from "next/image";
import { mockBookList } from "@/assets/mockData/books";
import { Book } from "@/types/book";
import star_png from '@/assets/images/star.png';
import { useRouter } from "next/router";

// export default function BookDetailCard({ bookId }: { bookId: string }) {
//     const [book, setBook] = useState(null);
  
//     useEffect(() => {
//       // Simulate API call or database fetch
//       fetch(`/api/books/${bookId}`)
//         .then((res) => res.json())
//         .then((data) => setBook(data));
//     }, [bookId]);
const BookDetailCard: React.FC<{ bookDetail: Book }> = ({ bookDetail })=> {

    return (
        <div className="flex relative h-full w-full justify-start px-24 py-12 space-x-6 border-b-[1px] border-zinc-200 mb-5">
            {/* Book Cover Section */}
            <div className="flex-1 flex justify-start rounded-sm max-w-sm">
                {/* <div className="relative w-40 sm:w-52 md:w-60 lg:w-64 h-60 sm:h-72 md:h-80 lg:h-96"> */}
                <div className="relative w-8 sm:w-20 md:w-24 lg:w-40 h-24 sm:h-36 md:h-44 lg:h-64">

                    <Image
                        alt="Book cover"
                        src={bookDetail.image}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-sm border border-zinc-300"
                    />
                </div>
            </div>

            {/* Book Info Section */}
            <div className="flex-2 justify-start space-y-2 text-sm p-4">
                <p className="text-lg font-bold">{bookDetail.title}</p>
                <p className='italic'>by {bookDetail.author}</p>
                <div className="flex space-x-2 items-center">
                    <Image src={star_png} alt="rating" width={15} height={15} />
                    <p>{bookDetail.rating}</p>
                </div>
                <p className="line-clamp-3">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
                <div className="flex space-x-2 items-center">
                    <p>Genres : </p>
                    <ul className="flex space-x-2">
                        {bookDetail.genres?.map((genre, index) => (
                            <li key={index} className="bg-zinc-600 px-2 py-1 rounded-lg text-white">{genre}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default BookDetailCard;
