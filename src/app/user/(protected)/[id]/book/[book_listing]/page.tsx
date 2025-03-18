"use client"
import BookListCard from "@/app/book/components/bookList";
import { use } from "react"
import SaleListingDetailCard from "@/app/user/components/SaleListingDetailCard";
import SaleProfileCard from "@/app/user/components/SaleProfileCard";
// Use async function to support dynamic params

export default function BookPage({ params }: { params: Promise<{ book_listing: string, id: string }> }) {
    // 1) Resolve the route params (be sure you actually need this 'Promise' usage).
    const resolvedParams = use(params);
    const book_listing = resolvedParams.book_listing;
    const owner_id = parseInt(resolvedParams.id);


    return (
        <div className="w-full bg-slate-100 px-10 pt-10 pb-1">
            <SaleListingDetailCard book_listing={book_listing} owner_id={owner_id} />
            <div>
                <SaleProfileCard id={owner_id} />
            </div>
            {/* <BookDetailCard bookId={params.id} /> */}
            <div className="px-20 py-2 space-y-6 bg-orange-300">
                <p className="font-bold text-xl">Someone who has the book</p>
            </div>
            <div className="px-20 py-2 space-y-6">
                <p className="font-bold text-xl">Recommended Similar Books</p>
                {/* <BookListCard/> */}
            </div>
        </div>
    );
};

