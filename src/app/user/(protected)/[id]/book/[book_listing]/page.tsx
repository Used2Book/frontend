"use client"
import { useParams } from "next/navigation";
import SaleListingDetailCard from "@/app/user/components/sale-listing-detail-card";
import SaleListingList from "@/app/user/components/sale-listing-list";
import MyRecommendedBookList from "@/app/user/components/my-recommendation-list";
import { getRecommendedBooks } from "@/services/book";
import { useEffect, useState } from "react";
import { Book } from "@/types/book";


export default function BookPage() {

    const { id, book_listing } = useParams();

    const owner_id = Number(id);
    const [book_id, _] = String(book_listing).split("-");

    const [loading, setLoading] = useState<boolean>(true)

    const [recommendedBookList, setRecommendedBookList] = useState<Book[]>([]);
    useEffect(() => {
        const fetchRecommendedBooks = async () => {
            try {
                const recommendBook = await getRecommendedBooks(30);
                setRecommendedBookList(recommendBook);
            } catch (error) {
                console.error("Failed to fetch recommended books:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendedBooks();
    }, []);

    return (
        <div className="w-full px-10 pt-10 pb-1">
            {book_listing ?
                <div>

                    <SaleListingDetailCard book_listing={String(book_listing)} owner_id={owner_id} />
                    <div className="px-10 py-2 space-y-6 mt-10">
                        <p className="font-semibold text-lg">Someone who has the book</p>
                        <SaleListingList bookID={parseInt(book_id)} />
                    </div>
                    <div className="px-10 py-2 space-y-6 mb-20 mt-10">
                        <p className="font-semibold text-lg">Recommended Similar Books</p>
                        <MyRecommendedBookList recommendedBookList={recommendedBookList} loading={loading}/>
                    </div>
                </div>
                : null
            }
        </div>
    );
};

