import Image from 'next/image';
import star_png from '@/assets/images/star.png';
import { Book } from '@/types/book'
import Link from 'next/link';


// export default function BookCard({ title, author, image, rating }: BookCardProps) {
const BookCard: React.FC<Book> = ({ title, author, image, rating, id }) => {
    return (
        // <Link href={{ pathname: "/book/[id]", params: { id: id.toString() } }}>
        // <Link href="/book/[id]" as={`/book/${id}`}>
        <Link href="/user/book">


            <div className="flex flex-col p-3 bg-white rounded-md w-20 sm:w-24 md:w-28 lg:w-28 shadow-md">
                <div className="w-full max-w-sm h-20 sm:h-24 md:h-28 lg:h-32 relative">
                    <Image
                        alt="Book cover"
                        src={image}
                        layout="fill"
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
                                <p>{rating}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>


    );
}
export default BookCard;
