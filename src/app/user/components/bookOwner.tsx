import Image from "next/image";
import star_png from "@/assets/images/star.png";
import { Book } from "@/types/book";
import Cat_Profile from "@/assets/images/cat-profile.jpg";
import Heart_Wish from "@/assets/images/heartWish.png";
import { useState } from "react";
import { Heart } from "lucide-react";


const BookOwnerCard: React.FC<Book> = ({ title, author, image, rating }) => {
    const [isWishlist, setIsWishlist] = useState(false);
    return (
        <div className="bg-white rounded-md pt-3 pb-2 w-[150px] shadow-md"> {/* This adds padding to the outer div */}

            {/* Book Cover Section */}
            <div className="flex flex-col justify-center items-center px-3 w-full">
                <div className="shadow-lg w-[40px] sm:w-[60px] md:w-[60px] justify-center">

                    <div className="w-full h-[80px] sm:h-[100px] md:h-[100px] relative rounded-sm overflow-hidden">
                        <Image
                            alt="Book cover"
                            src={image}
                            layout="fill"
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
            <div className="flex justify-between w-full mt-1 px-2 text-black border-b-[1px] border-gray-200">
                <div className="text-center flex-1 mx-1 rounded-md">
                    <p className="text-xxxxs">Ownership</p>
                    <p className="text-xxxs font-bold">Owned</p>
                </div>
                <div className="text-center flex-1 mx-1 rounded-md">
                    <p className="text-xxxxs">Price</p>
                    <p className="text-xxxs font-bold">70$</p>
                </div>
            </div>


            {/* Access & Deals */}
            <div className="flex justify-between w-full mt-1 px-2 text-black">
                <div className="text-center flex-1 mx-1 rounded-md">
                    <p className="text-xxxxs">Access</p>
                    <p className="text-xxxs font-bold">Can Buy</p>
                </div>
                <div className="text-center flex-1 mx-1 rounded-md">
                    <p className="text-xxxxs">Deals</p>
                    <p className="text-xxxs font-bold">Can Offer</p>
                </div>
            </div>

            <div className="px-2 w-full">
                <button className="bg-blue-500 text-white text-xxxxs font-bold w-full py-1 rounded-sm shadow-md hover:bg-blue-400 transition">
                    Edit
                </button>
            </div>




        </div>

    );
};

export default BookOwnerCard;
