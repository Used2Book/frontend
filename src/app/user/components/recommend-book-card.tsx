"use client";
import Image from "next/image";
import star_png from "@/assets/images/star.png";
import { Book } from "@/types/book";
import Vibrant from "node-vibrant";
import { useState, useEffect } from "react";
import Link from "next/link";
const getDominantColor = async (imageUrl: string): Promise<string> => {
    try {
        const palette = await Vibrant.from(imageUrl).getPalette();
        const vibrantColor = palette.Vibrant?.getRgb() || [0, 0, 0];
        const darkerTone = vibrantColor.map((value) => Math.max(value - 110, 0));
        return `rgb(${darkerTone[0]}, ${darkerTone[1]}, ${darkerTone[2]})`;
    } catch (err) {
        console.error("Error fetching vibrant color:", err);
        return "rgb(0, 0, 0)";
    }
};

const RecommendBookCard: React.FC<Book> = ({ id, title, author, cover_image_url, average_rating, description }) => {
    const [bgColor, setBgColor] = useState<string>("");

    useEffect(() => {
        const fetchColor = async () => {
            const color = await getDominantColor(cover_image_url);
            setBgColor(color);
        };
        fetchColor();
    }, [cover_image_url]);

    return (
        <Link href={`/book/${id}`}>
            <div
                className="flex h-full w-full items-center justify-center px-4 py-6 sm:px-8 sm:py-8 md:px-12 md:py-10 lg:px-16 lg:py-12 space-x-4 sm:space-x-6 md:space-x-8"
                style={{ backgroundColor: bgColor }}
            >
                {/* Book Cover Section */}
                <div className="flex-shrink-0 w-24 sm:w-32 md:w-40 lg:w-38 h-36 sm:h-48 md:h-60 lg:h-54 relative">
                    <Image
                        alt="Book cover"
                        src={cover_image_url}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 640px) 24vw, (max-width: 768px) 32vw, (max-width: 1024px) 40vw, 38vw"
                        className="rounded-sm border border-zinc-300"
                    />
                </div>

                {/* Book Info Section */}
                <div className="flex-1 text-white space-y-2 text-xs sm:text-sm md:text-base p-4 max-w-md">
                    <p className="text-base sm:text-lg md:text-xl lg:text-lg font-bold truncate">{title}</p>
                    <p className="italic truncate">by {author}</p>
                    <div className="flex space-x-2 items-center">
                        <Image src={star_png} alt="rating" width={12} height={12} className="sm:w-15 sm:h-15 md:w-18 md:h-18" />
                        <p>{average_rating ?? "N/A"}</p>
                    </div>
                    <p className="line-clamp-3 text-xs sm:text-sm md:text-base lg:text-sm">{description}</p>
                </div>
            </div>
        </Link>
    );
};

export default RecommendBookCard;