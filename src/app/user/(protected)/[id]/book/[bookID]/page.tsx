// import { useRouter } from 'next/router';
// import { notFound } from 'next/navigation';
// import { useState, useEffect } from 'react';
// import { getBookByID } from '@/services/book';
// import BookOwnerListCard from '../../../components/bookOwnerList';
// import BookOwnerDetailCard from '../../../components/bookOwnerDetail';

// export default function BookDetailPage({ params }: { params: { id: string } }) {
//     const [book, setBook] = useState(null); // Book state to store the fetched book details
//     const [loading, setLoading] = useState(true); // Loading state
//     const [error, setError] = useState<string | null>(null); // Error state

//     useEffect(() => {
//         const fetchBook = async () => {
//             const result = await getBookByID(params.id);
//             if (result) {
//                 setBook(result);
//             } else {
//                 setError('Book not found');
//             }
//             setLoading(false);
//         };

//         fetchBook();
//     }, [params.id]);

//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>{error}</div>;

//     return (
//         <div>
//             {book ? (
//                 <>
//                     <BookOwnerDetailCard bookDetail={book} />
//                     <div className="px-20 py-2 space-y-6">
//                         <p className="font-bold text-lg">Someone who has the book</p>
//                         <BookOwnerListCard />
//                     </div>
//                 </>
//             ) : (
//                 notFound() // Handle not found case properly
//             )}
//         </div>
//     );
// }
