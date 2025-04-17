import { httpClient} from "@/lib/http-client";
import useAuthStore from "@/contexts/auth-store";
import { toast } from "react-hot-toast";
import uploadClient from "@/lib/upload-client";
// ✅ Get user info (without modifying token)
export const getMe = async () => {
  try {
    console.log("Fetching user...");
    const { data } = await httpClient.get("user/me");

    if (data?.user) {
      useAuthStore.getState().setUser(data.user); // ✅ Only update Zustand once
      console.log("User fetched:", data.user);
      return data.user; // ✅ Return user for further use
    }

    return null;
  } catch (err) {
    console.warn("Failed to fetch user:", err);
    toast.error("Your session has expired. Please log in again.");
    useAuthStore.getState().clearAuth(); // ✅ Clear Zustand if API fails
    return null;
  }
};

export const getAllUsers = async () => {
  try {
    const res = await httpClient.get("/user/all");
    return res.data.users; // Extract "users" from response
  } catch (err) {
    console.error("Get All Users Failed:", err);
    throw err;
  }
};

// ✅ Upload Profile Image
export const uploadProfileImage = async (image: File) => {
  const formData = new FormData();
  formData.append("image", image);

  try {
    const res = await uploadClient.post("/user/upload-profile-image", formData);
    return res.data.image_profile_url;
  } catch (err) {
    console.error("Upload Profile Image Failed:", err);
    throw err;
  }
};

// ✅ Upload Background Image
export const uploadBackgroundImage = async (image: File) => {
  const formData = new FormData();
  formData.append("image", image);

  try {
    const res = await uploadClient.post("/user/upload-background-image", formData);
    return res.data.image_background_url;
  } catch (err) {
    console.error("Upload Background Image Failed:", err);
    throw err;
  }
};

// ✅ Update Account Info
export const editAccountInfo = async (userInfo: {
  first_name: string;
  last_name: string;
  phone_mumber: string;
}) => {
  try {
    const res = await httpClient.post("/user/edit-account-info", userInfo);
    return res.data;
  } catch (err) {
    console.error("Edit Account Info Failed:", err);
    throw err;
  }
};

export const editUsername = async (userInfo: {
  first_name: string;
  last_name: string;
}) => {
  try {
    const res = await httpClient.post("/user/edit-username", userInfo);
    return res.data;
  } catch (err) {
    console.error("Edit username Failed:", err);
    throw err;
  }
};

export const editProfile = async (userInfo: {
  first_name: string;
  last_name: string;
  address: string;
  quote: string;
  bio: string;
  phone_number: string;
}) => {
  try {
    console.log("userInfo:", userInfo)
    const res = await httpClient.post("/user/edit-profile", userInfo);
    toast.success("Edit Account Profile Successfully !")
    return res.data;
  } catch (err) {
    console.error("Edit Account Profile Failed:", err);
    throw err;
  }
};

export const userAddLibrary = async (userInfo: {
  book_id: number;
  reading_status: number;
}) => {
  try {
    const res = await httpClient.post("/user/add-library", userInfo);
    return res.data;
  } catch (err) {
    console.error("add book in library Failed:", err);
    throw err;
  }
};

export const userDeleteBookInLibrary = async (listing_id: number) => {
  try {
    const res = await httpClient.post(`/user/delete-user-library/${listing_id}`);
    if (res.data.success) {
      toast.success("delete from your library successfully !")
    }
  } catch (err) {
    console.error("add book in library Failed:", err);
    throw err;
  }
};

export const userAddListing = async (LibraryInfo: {
  book_id: number;
  price: number;
  allow_offers: boolean;
  seller_note: string;
  phone_number: string;
}, images: File[]) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(LibraryInfo));
  images.forEach((image) => formData.append("images", image));

  try {
      const res = await uploadClient.post("/user/add-listing", formData);
      return res.data;
  } catch (err) {
      console.error("Add book to listing Failed:", err);
      throw err;
  }
};

export const userCount = async () => {
  try {
    console.log("Fetching user count...");
    const res = await httpClient.get("user/user-count");
    console.log("user count :", res.data.count)
    return res.data.count
  } catch (err) {
    console.log("Get user count unsuccessfully !")
    return null
  }
};

export const userProfile = async (userID : number) => {
  try {
    console.log("Fetching user profile...");
    const res = await httpClient.get(`user/user-info/${userID}`);
    console.log("user profile :", res.data.user)
    return res.data.user
  } catch (err) {
    console.log("Get user profile unsuccessfully !")
    return null
  }
};

export const getUserWishlistByBookId = async (bookID : number) => {
  try {
    console.log("Fetching users wishlist by book id...");
    const res = await httpClient.get(`user/user-wishlist/${bookID}`);
    console.log("getUserWishlistByBookId :", res.data.users)
    console.log("get user wishlist by book id successfully !");
    return res.data.users
  } catch (err) {
    console.log("get user wishlist by book id unsuccessfully !")
    return null
  }
};

export const bookWishlistStatus = async (bookID : number) => {
  try {
    console.log("Fetching user profile...");
    const res = await httpClient.get(`user/book-wishlist/${bookID}`);
    console.log("user in_wishlist :", res.data.in_wishlist)
    if (res.data.in_wishlist){
      toast.success("Add to your wishlist successfully !");
    }else{
      toast.success("Remove from your wishlist successfully !");
    }
    return res.data.in_wishlist
  } catch (err) {
    console.log("add to wishlist unsuccessfully !")
    return null
  }
};

export const bookInitialWishlistStatus = async (bookID : number) => {
  try {
    console.log("Fetching wishlist ...");
    const res = await httpClient.get(`user/book-is-in-wishlist/${bookID}`);
    console.log("user is_in_wishlist :", res.data.in_wishlist)
    return res.data.in_wishlist
  } catch (err) {
    console.log("Get user init wishlist unsuccessfully !")
    return null
  }
};

export const myLibrary = async () => {
  try {
    console.log("Fetching user library...");
    const res = await httpClient.get("user/get-library");
    console.log("user library :", res.data.library)
    return res.data.library
  } catch (err) {
    console.log("Get user library unsuccessfully !")
    return null
  }
};

export const removeListing = async (listingId: number) => {
  try {
    console.log("remove listing ...");
    const res = await httpClient.post(`/user/listing/remove/${listingId}`);
    console.log("remove listing :", res.data)
    return res.data.success
  } catch (err) {
    console.log("remove listing unsuccessfully !")
    return null
  }
};

export const myListing = async () => {
  try {
    console.log("Fetching my listing ...");
    const res = await httpClient.get("user/get-listing");
    console.log("user listing :", res.data.listing)
    return res.data.listing
  } catch (err) {
    console.log("Get user listing unsuccessfully !")
    return null
  }
};

export const myPurchaseListing = async () => {
  try {
    console.log("Fetching user purchase listing...");
    const res = await httpClient.get("user/purchase-listing");
    console.log("user purchase listing :", res.data.listing)
    return res.data.listing
  } catch (err) {
    console.log("Get user listing unsuccessfully !")
    return null
  }
};

export const myOrders = async () => {
  try {
    console.log("Fetching my orders ...");
    const res = await httpClient.get("user/my-orders");
    console.log("my orders :", res.data.orders)
    return res.data.orders
  } catch (err) {
    console.log("Get my orders unsuccessfully !")
    return null
  }
};

export const getListingByID = async (listing_ID : number) => {
  try {
    console.log("Fetching listing...", listing_ID);
    const res = await httpClient.get(`user/get-listing-by-id/${listing_ID}`);
    console.log("listing detail :", res.data.listing)
    return res.data.listing
  } catch (err) {
    console.log("Get user listing unsuccessfully !")
    return null
  }
};

export const myWishList = async () => {
  try {
    console.log("Fetching user library...");
    const res = await httpClient.get("user/get-wishlist");
    console.log("user wishlist :", res.data.wishlist)
    return res.data.wishlist
  } catch (err) {
    console.log("Get user wishlist unsuccessfully !")
    return null
  }
};

export const userLibrary = async (id:number) => {
  try {
    console.log("Fetching user library...");
    const res = await httpClient.get(`user/get-library/${id}`);
    console.log("user library :", res.data.library)
    return res.data.library
  } catch (err) {
    console.log("Get user library unsuccessfully !")
    return null
  }
};

export const userListing = async (id: number) => {
  try {
    console.log("Fetching user library...");
    const res = await httpClient.get(`user/get-listing/${id}`);
    console.log("user listing :", res.data.listing)
    return res.data.listing
  } catch (err) {
    console.log("Get user listing unsuccessfully !")
    return null
  }
};

export const userWishList = async (id: number) => {
  try {
    console.log("Fetching user library...");
    const res = await httpClient.get(`user/get-wishlist/${id}`);
    console.log("user wishlist :", res.data.wishlist)
    return res.data.wishlist
  } catch (err) {
    console.log("Get user wishlist unsuccessfully !")
    return null
  }
};

export async function createBankAccount(data: {
  bank_account_number: string;
  bank_account_name: string;
  bank_code: string;
}) {
  try {
    const res = await httpClient.post("/user/create-bank-account", data);
    return res.data;
  } catch (error) {
    console.error("Error - bank account:", error);
    throw error;
  }
}

export async function buyListing(listingId: number) {
  const res = await httpClient.post("user/api/stripe/create-payment-intent", {listingId: listingId });
  const data = await res.data;
  if (!data.clientSecret) {
    toast.error("Could not create payment intent");
    return;
  }
  return data.clientSecret
}

// export async function processPayment(paymentData: {
//   listing_id: number;
//   token: string;
// }) {
//   try {
//     const res = await httpClient.post("/payment/charge", paymentData);
//     return res.data;
//   } catch (err) {
//     console.error("Payment failed:", err);
//     throw err;
//   }
// }

export async function markListingAsSold(listingId: number, amount: number) {
  try {
      const res = await httpClient.post("/user/listing/sold", { listing_id: listingId, amount });

      if (res.data.ok) {
          toast.success("Listing marked as sold!");
      } else {
          toast.error("Error: " + res.data.message);
      }
  } catch (error) {
      console.error("Failed to mark listing as sold:", error);
  }
}

export async function setUserPreferredGenres(genreIDs: number[]) {
  try {
    const res = await httpClient.post("/user/preferences", { genre_ids: genreIDs });
    return res.data.genres;
  } catch (error) {
    console.error("Error setting user preferences:", error);
    return null;
  }
};

export async function createBookRequest(bookInfo: {
  title: string;
  isbn: string;
  note: string;
}) {
  try {
    const res = await httpClient.post("/user/book-request", bookInfo); // Send flat object
    if (res.data.success) {
      return res.data; // Return data to allow handleSubmit to handle toasts
    } else {
      throw new Error(res.data.message || "Something went wrong");
    }
  } catch (error) {
    throw new Error((error as Error).message || "Failed to send book request");
  }
}



export async function getAllUserGenres() {
  try {
    const res = await httpClient.get("/user/preferences");
    return res.data.preferred_genres || []; // ✅ Ensures an empty array instead of `null`
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return []; // ✅ Ensures it never returns `null`
  }
};

export async function getUserGender() {
  try {
    const res = await httpClient.get("/user/gender");
    return res.data.gender; // ✅ Ensures an empty array instead of `null`
  } catch (error) {
    console.error("Error fetching user gender:", error);
    toast.error("error : " + error)
  }
};

export async function updateGender(gender: string) {
  try {
    console.log("gender:", gender)
    const res = await httpClient.post("/user/gender", {gender: gender});
    console.log("res gender:", res)
    return res.data
  } catch (error) {
    console.error("Error fetching user gender:", error);
    toast.error("error : " + error)
  }
};

export async function getBookRequest() {
  try {
      const res = await httpClient.get("/user/book-request");
      console.log("res requests:", res.data.reqs)
      return res.data.reqs
  } catch (error) {
      console.error("Error get book request:", error);
      toast.error("error : " + error)
  }
};

