import Image from "next/image";
import star_png from "@/assets/images/star.png";
import { Book } from "@/types/book";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { userDeleteBookInLibrary } from "@/services/user";

const UserLibraryCard: React.FC<
  Book & { delete_: boolean; library_id: number; onDelete: () => void }
> = ({
  title,
  author,
  cover_image_url,
  id,
  average_rating,
  reading_status,
  delete_,
  library_id,
  onDelete,
}) => {
  const statusStyles: { [key: number]: string } = {
    1: "bg-green-100 text-green-800",
    0: "bg-orange-100 text-orange-800",
  };

  const HandleDeleteBookFromLibrary = async (id: number) => {
    try {
      await userDeleteBookInLibrary(id);
      onDelete(); // Trigger parent's onDelete callback
    } catch (error) {
      console.error("Error deleting book from library:", error);
    }
  };

  return (
    <div className="flex flex-col p-3 bg-white rounded-md w-20 sm:w-24 md:w-28 lg:w-28 shadow-md border border-gray-100">
      <div className="w-full max-w-sm h-20 sm:h-24 md:h-28 lg:h-32 relative">
        <Link href={`/book/${id}`} passHref>
          <Image
            alt="Book cover"
            src={cover_image_url}
            fill
            objectFit="cover"
            className="rounded-sm border-[1px] border-zinc-300 shadow-md"
          />
        </Link>
        {delete_ && (
          <button
            onClick={() => HandleDeleteBookFromLibrary(library_id)}
            className="absolute top-0 right-0 flex items-center justify-start p-1 rounded-md bg-gray-200 text-sm text-gray-600 hover:text-red-600 transition-all duration-200"
            title="Remove From Library"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <div className="flex flex-col mt-2 space-y-1 text-xxxs text-gray-500">
        <div>
          <h3 className="text-xxs font-semibold text-black truncate">
            {title.length > 15 ? `${title.slice(0, 15)}...` : title}
          </h3>
        </div>
        <div className="flex mt-3 justify-between items-center space-x-3">
          <div>
            <p className="text-ellipsis overflow-hidden whitespace-nowrap">
              {author[0].length > 9 ? `${author[0].slice(0, 9)}...` : author[0]}
            </p>
          </div>
          <div className="flex space-x-1">
            <div>
              <Image src={star_png} alt="rating" width={10} height={10} />
            </div>
            <div>
              <p>{average_rating}</p>
            </div>
          </div>
        </div>
        <span
          className={`inline-block px-1 py-0.5 text-xxxs font-medium rounded-full text-center ${
            statusStyles[reading_status] || "bg-gray-100 text-gray-800"
          }`}
        >
          {reading_status === 0 ? "Currently Reading" : "Finished Reading"}
        </span>
      </div>
    </div>
  );
};

export default UserLibraryCard;