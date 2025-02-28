"use client"
import BookListCard from "@/app/book/components/bookList";
import BookOwnerDetailCard from "@/app/user/components/bookOwnerDetail";
import {use} from "react"
import SaleListingDetailCard from "@/app/user/components/SaleListingDetailCard";
// Use async function to support dynamic params

export default function BookPage({ params }: { params: Promise<{ book_listing: string }> }) {
    // 1) Resolve the route params (be sure you actually need this 'Promise' usage).
    const resolvedParams = use(params);
    const book_listing = resolvedParams.book_listing;
    
    return (
        <div>
            <SaleListingDetailCard book_listing={book_listing}/>
            {/* <BookDetailCard bookId={params.id} /> */}
            <div className="px-20 py-2 space-y-6">
                <p className="font-bold text-xl">Someone who has the book</p>
            </div>
            <div className="px-20 py-2 space-y-6">
                <p className="font-bold text-xl">Recommended Similar Books</p>
                {/* <BookListCard/> */}
            </div>
        </div>
    );
};

