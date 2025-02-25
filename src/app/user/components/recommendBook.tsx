"use client"
import Image from 'next/image';
import star_png from '@/assets/images/star.png';
import { Book } from '@/types/book';
import Vibrant from 'node-vibrant';
import { useState, useEffect} from 'react';
import { Carousel } from "@material-tailwind/react";

const getDominantColor = async (imageUrl: string): Promise<string> => {
    try {
      const palette = await Vibrant.from(imageUrl).getPalette();
      const vibrantColor = palette.Vibrant?.getRgb() || [0, 0, 0]; // Default to black
      const darkerTone = vibrantColor.map((value) => Math.max(value - 110, 0));
      return `rgb(${darkerTone[0]}, ${darkerTone[1]}, ${darkerTone[2]})`;
    } catch (err) {
      console.error("Error fetching the vibrant color:", err);
      return "rgb(0, 0, 0)"; // Return black if there's an error
    }
  };
  


const RecommendBookCard: React.FC<Book> = ({ title, author, cover_image_url, rating }) => {
    const [bgColor, setBgColor] = useState<string>('');

    useEffect(() => {
        // Call the async function to set the background color
        const fetchColor = async () => {
            const color = await getDominantColor(cover_image_url); // url
            setBgColor(color);
        };
        
        fetchColor();
    }, [cover_image_url]);

    return (
        <div className="flex relative h-full w-full justify-center items-center px-72 py-12 space-x-6" style={{
            backgroundColor: bgColor,
        }}>
            {/* Book Cover Section */}
            <div className="flex-1 flex justify-end rounded-sm max-w-sm">
                {/* <div className="relative w-40 sm:w-52 md:w-60 lg:w-64 h-60 sm:h-72 md:h-80 lg:h-96"> */}
                <div className="relative w-8 sm:w-20 md:w-24 lg:w-40 h-24 sm:h-36 md:h-44 lg:h-60">

                    <Image
                        alt="Book cover"
                        src={cover_image_url}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-sm border border-zinc-300"
                    />
                </div>
            </div>

            {/* Book Info Section */}
            <div className="flex-1 text-white space-y-2 text-sm p-4">
                <p className="text-lg font-bold">{title}</p>
                <p className='italic'>by {author}</p>
                <div className="flex space-x-2 items-center">
                    <Image src={star_png} alt="rating" width={15} height={15} />
                    <p>{rating}</p>
                </div>
                <p className="line-clamp-3">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
            </div>
        </div>
    );
};

export default RecommendBookCard;
