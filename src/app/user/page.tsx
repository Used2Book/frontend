import BookListCard from "./components/bookList";
import ProfileCard from "./components/profile";
export default function UserPage() {
    return (
        <div className="flex space-x-4">

            {/* <BookListCard /> */}
            {/* <RecommendBookCard /> */}
            <ProfileCard/>
        </div>
    );
}