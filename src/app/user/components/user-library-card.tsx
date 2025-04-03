import Image from 'next/image';
import star_png from '@/assets/images/star.png';
import { Book } from '@/types/book'
import Link from 'next/link';


// export default function UserLibraryCard({ title, author, image, rating }: BookCardProps) {
const UserLibraryCard: React.FC<Book> = ({ title, author, cover_image_url, id,  average_rating, reading_status}) => {
    
    const statusStyles: { [key: number]: string } = {
        1: "bg-green-100 text-green-800",
        0: "bg-orange-100 text-orange-800",
        
    };

    console.log(title, "reading_status: " ,reading_status)
    return (
        // <Link href={{ pathname: "/book/[id]", params: { id: id.toString() } }}>
        // <Link href="/book/[id]" as={`/book/${id}`}>
        <Link href={`/book/${id}`} passHref>
            <div className="flex flex-col p-3 bg-white rounded-md w-20 sm:w-24 md:w-28 lg:w-28 shadow-md border border-gray-100">
                <div className="w-full max-w-sm h-20 sm:h-24 md:h-28 lg:h-32 relative">
                    <Image
                        alt="Book cover"
                        src={cover_image_url}
                        fill
                        objectFit="cover"
                        className="rounded-sm border-[1px] border-zinc-300 shadow-md"
                    />
                </div>

                <div className="flex flex-col mt-2 space-y-1 text-xxxs text-gray-500">
                    <div>
                        <h3 className="text-xxs font-semibold text-black truncate">
                            {title.length > 15 ? `${title.slice(0, 15)}...` : title}
                        </h3>
                    </div>
                    <div className="flex mt-3 justify-between items-center space-x-3 ">
                        <div >
                            {/* <p className=""> */}
                            <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                                {author.length > 9 ? `${author.slice(0, 9)}...` : author}
                            </p>
                        </div>
                        <div className='flex space-x-1'>
                            <div>
                                <Image src={star_png} alt="rating" width={10} height={10} />
                            </div>
                            <div>
                                <p>{average_rating}</p>
                            </div>
                        </div>
                    </div>
                    <span
                        className={`inline-block px-1 py-0.5 text-xxxs font-medium rounded-full text-center ${statusStyles[reading_status] || "bg-gray-100 text-gray-800"
                            }`}
                    >
                        {reading_status === 0 ? "Currently Reading" : "Finished Reading"}
                    </span>
                    
                </div>
            </div>
        </Link>


    );
}
export default UserLibraryCard;
