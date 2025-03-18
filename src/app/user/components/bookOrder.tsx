import Image from "next/image";
import star_png from "@/assets/images/star.png";
import { Book } from "@/types/book";
import Cat_Profile from "@/assets/images/cat-profile.jpg";
import Heart_Wish from "@/assets/images/heartWish.png";
import { useState } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";

const BookOrderCard: React.FC<Book> = ({ title, author, cover_image_url, rating }) => {
    const [isWishlist, setIsWishlist] = useState(false);
    return (
        <Link href="/user/book">
            <div className="bg-white rounded-md py-3 w-[150px] shadow-md"> {/* This adds padding to the outer div */}

                {/* Book Cover Section */}
                <div className="flex flex-col justify-center items-center px-3 w-full">
                    <div className="shadow-lg w-[40px] sm:w-[60px] md:w-[60px] justify-center">

                        <div className="w-full h-[80px] sm:h-[100px] md:h-[100px] relative rounded-sm overflow-hidden">
                            <Image
                                alt="Book cover"
                                src={cover_image_url}
                                fill
                                objectFit="cover"
                                className="border border-gray-300 shadow-md"
                            />
                        </div>
                    </div>

                    {/* Book Info */}
                    <div className="w-full text-center mt-2">
                        <h3 className="text-xxs font-bold text-black truncate">
                            {title.length > 15 ? `${title.slice(0, 15)}...` : title}
                        </h3>
                        <p className="text-xxxs text-gray-500 truncate">
                            {author.length > 10 ? `${author.slice(0, 10)}...` : author}
                        </p>

                        {/* Rating */}
                        <div className="flex justify-center items-center space-x-1 text-gray-500">
                            <Image src={star_png} alt="rating" width={10} height={10} />
                            <p className="text-xxxxs font-medium">{rating}</p>
                        </div>
                    </div>

                </div>
                {/* Seller Profile */}
                <div className="flex justify-center items-center w-full py-1 mt-1 border-y-[1px] border-gray-200">
                    <div className="w-4 h-4 rounded-full overflow-hidden">
                        <Image src={Cat_Profile} alt="Profile" width={30} height={30} />
                    </div>
                    <p className="ml-2 text-xxxs font-bold">John Doe</p>
                </div>

                {/* Ownership and Price */}
                <div className="flex justify-between w-full mt-1 px-2 text-black">
                    <div className="text-center flex-1 mx-1 rounded-md">
                        <p className="text-xxxxs">Ownership</p>
                        <p className="text-xxxs font-bold">Owned</p>
                    </div>
                    <div className="text-center flex-1 mx-1 rounded-md">
                        <p className="text-xxxxs">Price</p>
                        <p className="text-xxxs font-bold">70$</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="w-full px-3">
                    <button className="bg-black text-white text-xxxxs font-bold w-full py-1 rounded-sm shadow-md hover:bg-zinc-700 transition">
                        Buy
                    </button>
                    <div className="flex justify-center items-center mt-1 w-full space-x-1">
                        <div>
                            {/* <Image src={Heart_Wish} alt="wishlist" width={12} height={12} /> */}
                            {/* Heart Button */}
                            <button
                                onClick={() => setIsWishlist(!isWishlist)}
                                className="w-6 h-6 flex justify-center items-center rounded-md transition"
                            >
                                <Heart
                                    size={15} // Adjust size
                                    className={`transition ${isWishlist ? "fill-red-500 text-red-500" : "fill-none text-black hover:text-red-500"
                                        }`}
                                />
                            </button>
                        </div>
                        <button className="flex-1 font-bold text-xxxxs py-[1px] rounded-sm border-[1.5px] border-black shadow-md hover:bg-zinc-300 transition">
                            Make an Offer
                        </button>
                    </div>
                </div>
            </div>
        </Link>

    );
};

export default BookOrderCard;
