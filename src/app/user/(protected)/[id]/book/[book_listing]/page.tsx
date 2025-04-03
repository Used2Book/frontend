"use client"
import BookListCard from "@/app/book/components/book-list";
import { use } from "react"
import SaleListingDetailCard from "@/app/user/components/sale-listing-detail-card";
import SaleProfileCard from "@/app/user/components/sale-profile-card";
import SaleListingList from "@/app/user/components/sale-listing-list";
import MyRecommendedBookList from "@/app/user/components/my-recommendation-list";
// Use async function to support dynamic params

export default function BookPage({ params }: { params: Promise<{ book_listing: string, id: string }> }) {
    // 1) Resolve the route params (be sure you actually need this 'Promise' usage).
    const resolvedParams = use(params);
    const book_listing = resolvedParams.book_listing;
    const owner_id = parseInt(resolvedParams.id);
    const [book_id, _] = book_listing.split("-");




    return (
        <div className="w-full bg-slate-100 px-10 pt-10 pb-1">
            <SaleListingDetailCard book_listing={book_listing} owner_id={owner_id} />
            <div>
                <SaleProfileCard id={owner_id} />
            </div>
            {/* <BookDetailCard bookId={params.id} /> */}

            <div className="px-10 py-2 space-y-6 mt-10">
                <p className="font-semibold text-lg">Someone who has the book</p>
                <SaleListingList bookID={parseInt(book_id)} />
            </div>
            <div className="px-10 py-2 space-y-6 mb-20 mt-10">
                <p className="font-semibold text-lg">Recommended Similar Books</p>
                <MyRecommendedBookList />
            </div>
        </div>
    );
};

