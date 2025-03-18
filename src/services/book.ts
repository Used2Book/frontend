import { httpClient} from "@/lib/http-client";
import useAuthStore from "@/contexts/auth-store";
import { toast } from "react-hot-toast";

// ✅ Get user info (without modifying token)
export const bookCount = async () => {
    try {
        console.log("Fetching book count...");
        const res = await httpClient.get("book/book-count");
        console.log("book count :", res.data.count)
        return res.data.count
    } catch (err) {
        console.log("Get book count unsuccessfully !")
        return null
    }
};

export async function getAllGenres() {
    try {
      const res = await httpClient.get("/book/all-genres");
      return res.data.genres || [];
    } catch (error) {
      console.error("Error setting user preferences:", error);
      return null;
    }
  };



export const getBookReview = async (book_id:number) => {
    try {
        console.log("Fetching book review...");
        const res = await httpClient.get(`book/${book_id}/get-reviews`);
        console.log("book reviews :", res.data.reviews)
        return res.data.reviews
    } catch (err) {
        console.log("Get book reviews unsuccessfully !")
        return null
    }
};

export const addBookReview = async (data: {book_id:number, rating:number, comment:string}) => {
    try {
        console.log("Add book review...");
        const res = await httpClient.post("book/add-review", data);
        console.log("add book review :", res.data.success)
        toast.success("Add review successfully !")
        return res.data.success
    } catch (err) {
        toast.error("Add review unsuccessfully !")
        console.log("Add Review book unsuccessfully !")
        return null
    }
};

export const allBooks = async () => {
    try {
        console.log("Fetching book count...");
        const res = await httpClient.get("book/all-books");
        console.log("books:", res.data.books)
        return res.data.books
    } catch (err) {
        console.log("Get book count unsuccessfully !")
        return null
    }
};

export const getRecommendedBooks = async () => {
    try {
        console.log("Fetching recommended book ...");
        const res = await httpClient.get("book/recommended-books");
        console.log("books:", res.data.books)
        return res.data.books.slice(0, 3)
    } catch (err) {
        console.log("Get book count unsuccessfully !")
        return null
    }
};

// ✅ Get book by ID
export const getBookByID = async (bookID: any) => {
    try {
        console.log(`Fetching book with ID: ${bookID}...`);
        const res = await httpClient.get(`book/get-book/${bookID}`);
        console.log("book:", res.data.book);
        return res.data.book;
    } catch (err) {
        console.log("Get book by ID unsuccessfully !");
        return null;
    }
};

// ✅ Get book by ID
export const getGenresBookByID = async (bookID: any) => {
    try {
        console.log(`Fetching book with ID: ${bookID}...`);
        const res = await httpClient.get(`book/get-book-genres/${bookID}`);
        console.log("genres:", res.data.genres);
        return res.data.genres;
    } catch (err) {
        console.log("Get book genres by ID unsuccessfully !");
        return null;
    }
};

export const getBookListingByID = async (bookID: any) => {
    try {
        console.log(`Fetching book listing with ID: ${bookID}...`);
        const res = await httpClient.get(`book/${bookID}/listings`);
        console.log("books book_id:", res.data.listings);
        return res.data.listings;
    } catch (err) {
        console.log("Get book by book ID unsuccessfully !");
        return null;
    }
};
