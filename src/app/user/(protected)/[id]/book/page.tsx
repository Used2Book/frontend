"use client"
import { useRouter } from 'next/router';
import { notFound } from 'next/navigation';
import { mockBookList, mockBookOwnerList } from '@/assets/mockData/books';
import BookOwnerListCard from '../../../components/bookOwnerList';
import BookDetailCard from '../../../../book/components/bookDetail';
import BookOrderListCard from '../../../components/bookOrderList';
import BookOwnerDetailCard from '../../../components/bookOwnerDetail';
import ReviewCard from '../../../components/review';
import ReviewListCard from '../../../components/reviewList';
import BookListCard from '@/app/book/components/bookList';
import { useEffect, useState } from 'react';
import { allBooks } from '@/services/book';
import { Book } from '@/types/book';
// Use async function to support dynamic params
export default function BookPage({ params }: { params: { id: string } }) {
    // const bookDetail = mockBookList.find((book) => book.id.toString() === params.id);

    // if (!bookDetail) return notFound(); // Handle not found case properly
    const bookDetail = mockBookOwnerList[0]


    return (
        <div>
            <BookOwnerDetailCard bookDetail={bookDetail} />
            {/* <BookDetailCard bookId={params.id} /> */}
            <div className="px-20 py-2 space-y-6">
                <p className="font-bold text-xl">Someone who has the book</p>
                <BookOrderListCard />
            </div>
            <div className="px-20 py-2 space-y-6 mt-5">
                <p className="font-bold text-xl">Ratings & Reviews</p>
                <ReviewListCard />
            </div>
            <div className="px-20 py-2 space-y-6">
                <p className="font-bold text-xl">Recommended Similar Books</p>
                <BookListCard/>
            </div>
        </div>
    );
};

