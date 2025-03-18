import Image from "next/image";
import star_png from "@/assets/images/star.png";
import { SaleBook } from "@/types/book";
import NoAvatar from "@/assets/images/no-avatar.png";
import { useState, useEffect } from "react";
import { userProfile } from "@/services/user";
import Link from "next/link";

const SaleListingCard: React.FC<{ book: SaleBook }> = ({ book }) => {
    const [seller, setSeller] = useState(null);
    useEffect(() => {
        // Fetch the book count when the component mounts
        const fetchSeller = async () => {
            console.log("book seller id :", book.seller_id)
            console.log("book - :", book)

            const seller_profile = await userProfile(book.seller_id);
            setSeller(seller_profile)
        };

        fetchSeller();

    }, []);

    return (
        <Link href={`/user/${book.seller_id}/book/${book.book_id}_${book.id}`}>
            <div className="flex flex-col p-3 bg-white rounded-md w-20 sm:w-24 md:w-28 lg:w-28 shadow-md">
                <div className="w-full max-w-sm h-20 sm:h-24 md:h-28 lg:h-32 relative">
                    <Image
                        alt="Book cover"
                        src={book.cover_image_url}
                        fill
                        objectFit="cover"
                        className="rounded-sm border-[1px] border-zinc-300 shadow-md"
                    />
                </div>

                <div className="flex flex-col mt-2 space-y-1 text-xxxs">
                    <h3 className="text-xxs font-semibold text-black truncate">
                        {book.title.length > 15 ? `${book.title.slice(0, 15)}...` : book.title}
                    </h3>

                    <div className="flex mt-3 justify-between items-center space-x-3 text-gray-500">
                        <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                            {book.author.length > 9 ? `${book.author.slice(0, 9)}...` : book.author}
                        </p>
                        <div className="flex space-x-1">
                            <Image src={star_png} alt="rating" width={10} height={10} />
                            <p>{book.rating}</p>
                        </div>
                    </div>

                    {/* Seller Profile */}
                    {/* <div className="flex justify-center items-center w-full py-1 mt-1 border-y-[1px] border-gray-200">
                        <div className="w-4 h-4 rounded-full overflow-hidden">
                            <Image src={seller?.picture_profile ? seller?.picture_profile : NoAvatar} alt="Profile" width={30} height={30} />
                        </div>
                        <p className="ml-2 text-xxxs font-bold">{seller?.first_name}</p>
                    </div> */}

                    {/* Ownership and Price */}
                    <div className="flex justify-between w-full mt-1 text-black space-x-4 rounded-md py-1 px-2 bg-zinc-200">
                        <div className="text-start flex-1">
                            <p className="text-xxxxs">Offer</p>
                            <p className="text-xxxs font-bold">{book.allow_offers ? "Yes" : "No"}</p>
                        </div>
                        <div className="text-end flex-1">
                            <p className="text-xxxxs">Price</p>
                            <p className="text-xxxs font-bold">{book.price}฿</p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default SaleListingCard;


