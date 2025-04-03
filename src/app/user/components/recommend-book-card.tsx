"use client";
import Image from "next/image";
import star_png from "@/assets/images/star.png";
import { Book } from "@/types/book";
import {Vibrant} from "node-vibrant/browser"; // Use node-vibrant/browser
import { useState, useEffect } from "react";
import Link from "next/link";

const getDominantColor = async (imageUrl: string, opacity: number = 0.1): Promise<string> => {
    const clampedOpacity = Math.min(Math.max(opacity, 0), 1);
    try {
        const palette = await Vibrant.from(imageUrl).getPalette();
        const vibrantColor = palette.Vibrant?.rgb || [0, 0, 0];
        const darkerTone = vibrantColor.map((value) => Math.max(value - 10, 0));
        return `rgba(${darkerTone[0]}, ${darkerTone[1]}, ${darkerTone[2]}, ${clampedOpacity})`;
    } catch (err) {
        console.error("Error fetching vibrant color:", err);
        return `rgba(0, 0, 0, ${clampedOpacity})`;
    }
};

const RecommendBookCard: React.FC<Book> = ({ id, title, author, cover_image_url, average_rating, description }) => {
    const [bgColor, setBgColor] = useState<string>("rgba(0, 0, 0, 0.1)");

    useEffect(() => {
        const fetchColor = async () => {
            if (cover_image_url) {
                const color = await getDominantColor(cover_image_url);
                setBgColor(color);
            }
        };
        fetchColor();
    }, [cover_image_url]);

    return (
        <Link href={`/book/${id}`} className="block h-full w-full">
            <div
                className="flex h-full w-full items-center justify-center px-4 py-6 sm:px-8 sm:py-8 md:px-12 md:py-10 lg:px-16 lg:py-12 space-x-4 sm:space-x-6 md:space-x-8 transition-colors duration-300 hover:bg-opacity-80"
                style={{ backgroundColor: bgColor }}
            >
                {/* Book Cover Section */}
                <div className="flex-shrink-0 w-24 sm:w-32 md:w-40 lg:w-48 h-36 sm:h-52 md:h-64 lg:h-72 relative">
                    <Image
                        alt={`Cover of ${title}`}
                        src={cover_image_url || "/placeholder-book-cover.jpg"}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 640px) 24vw, (max-width: 768px) 32vw, (max-width: 1024px) 40vw, 48vw"
                        className="rounded-sm border border-zinc-300"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHXwJVnNdLegAAAABJRU5ErkJggg=="
                    />
                </div>

                {/* Book Info Section */}
                <div className="flex-1 text-black space-y-2 text-xs sm:text-sm md:text-base p-4 max-w-md">
                    <p className="text-base sm:text-lg md:text-xl lg:text-lg font-bold truncate">{title}</p>
                    <p className="truncate text-zinc-800 text-sm">by {author}</p>
                    <div className="flex space-x-2 items-center">
                        <Image
                            src={star_png}
                            alt="rating star"
                            width={12}
                            height={12}
                            className="sm:w-[15px] sm:h-[15px] md:w-[18px] md:h-[18px]"
                        />
                        <p className="text-zinc-600">{average_rating ?? "N/A"}</p>
                    </div>
                    <p className="line-clamp-3 text-xs sm:text-sm md:text-base lg:text-sm text-zinc-700">{description}</p>
                </div>
            </div>
        </Link>
    );
};

export default RecommendBookCard;