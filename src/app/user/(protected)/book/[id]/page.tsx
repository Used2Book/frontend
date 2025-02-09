import { useRouter } from 'next/router';
import { notFound } from 'next/navigation';
import { mockBookList } from '@/assets/mockData/books';
import BookOwnerListCard from '../../../components/bookOwnerList';
import BookDetailCard from '../../../../book/components/bookDetail';
import BookOwnerDetailCard from '../../../components/bookOwnerDetail';
// Use async function to support dynamic params
export default function BookDetailPage({ params }: { params: { id: string } }) {
    // const bookDetail = mockBookList.find((book) => book.id.toString() === params.id);

    // if (!bookDetail) return notFound(); // Handle not found case properly
    const bookDetail = mockBookList[0]

    return (
        <div>
            <BookOwnerDetailCard bookDetail={bookDetail} />
            {/* <BookDetailCard bookId={params.id} /> */}
            <div className="px-20 py-2 space-y-6">
                <p className="font-bold text-lg">Someone who has the book</p>
                <BookOwnerListCard/>
            </div>
        </div>
    );
};

