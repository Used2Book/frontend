import Image from "next/image";
import star_png from "@/assets/images/star.png";
import { Book } from "@/types/book";
import Link from 'next/link';


const BookOwnerCard: React.FC<Book & { price: number; status: string }> = ({
    title,
    author,
    cover_image_url,
    rating,
    price,
    status,
    allow_offers
}) => {
    return (
        <Link href="#">
            <div className="flex flex-col p-3 bg-white rounded-md w-20 sm:w-24 md:w-28 lg:w-28 shadow-md">
                <div className="w-full max-w-sm h-20 sm:h-24 md:h-28 lg:h-32 relative">
                    <Image
                        alt="Book cover"
                        src={cover_image_url}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-sm border-[1px] border-zinc-300 shadow-md"
                    />
                </div>

                <div className="flex flex-col mt-2 space-y-1 text-xxxs">
                    <h3 className="text-xxs font-semibold text-black truncate">
                        {title.length > 15 ? `${title.slice(0, 15)}...` : title}
                    </h3>

                    <div className="flex mt-3 justify-between items-center space-x-3 text-gray-500">
                        <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                            {author.length > 9 ? `${author.slice(0, 9)}...` : author}
                        </p>
                        <div className="flex space-x-1">
                            <Image src={star_png} alt="rating" width={10} height={10} />
                            <p>{rating}</p>
                        </div>
                    </div>

                    {/* Seller Profile
                    <div className="flex justify-center items-center w-full py-1 mt-1 border-y-[1px] border-gray-200">
                        <div className="w-4 h-4 rounded-full overflow-hidden">
                            <Image src={Cat_Profile} alt="Profile" width={30} height={30} />
                        </div>
                        <p className="ml-2 text-xxxs font-bold">John Doe</p>
                    </div> */}

                    {/* Ownership and Price */}
                    <div className="flex justify-between w-full mt-1 text-black space-x-4 rounded-md py-1 px-2 bg-zinc-200">
                        <div className="text-start flex-1">
                            <p className="text-xxxxs">Offer</p>
                            <p className="text-xxxs font-bold">{allow_offers ? "Yes" : "No"}</p>
                        </div>
                        <div className="text-end flex-1">
                            <p className="text-xxxxs">Price</p>
                            <p className="text-xxxs font-bold">{price}฿</p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default BookOwnerCard;


