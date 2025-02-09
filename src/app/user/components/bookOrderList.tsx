"use client";
import React, { useState } from "react";
import BookOrderCard from "@/app/user/components/bookOrder";
import { mockBookCarouselList } from "@/assets/mockData/books";
import { Book } from "@/types/book";

const BookOrderListCard: React.FC = () => {
    const [bookList, setBookList] = useState<Book[]>(mockBookCarouselList);

    return (
        <div className="w-full bg-zinc-100 shadow-sm rounded-md">
            {/* Use Tailwind classes to hide scrollbar */}
            <div className="flex space-x-6 overflow-x-auto py-4 scrollbar-hide mx-3">
                {bookList.map((book) => (
                    <div key={book.id}>
                        <BookOrderCard
                            id={book.id}
                            title={book.title}
                            author={book.author}
                            image={book.image}
                            rating={book.rating}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookOrderListCard;

// "use client";
// import React, { useState } from "react";
// import BookCard from "@/app/user/components/book";
// import { Book } from "@/types/book";
// import { mockBookList } from "@/assets/mockData/books";
// import BookOrderCard from "@/app/user/components/bookOrder";
// import { mockBookCarouselList } from "@/assets/mockData/books";

// const BookOrderListCard: React.FC = () => {
//     const [bookList, setBookList] = useState<Book[]>(mockBookCarouselList);
    
//     return (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 place-items-center">

//         {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-9 gap-10"> */}
//             {bookList.map((book) => (
//                 <BookOrderCard
//                     key={book.id}
//                     id={book.id}
//                     title={book.title}
//                     author={book.author}
//                     image={book.image}
//                     rating={book.rating}
//                 />
//             ))}
//         </div>
//     );
// };

// export default BookOrderListCard;
