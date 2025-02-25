import { httpClient, uploadClient } from "@/lib/http-client";
import useAuthStore from "@/contexts/auth-store";
import { toast } from "react-hot-toast";

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

export const editPreferrence = async (userInfo: {
  quote: string;
  bio: string;
}) => {
  try {
    const res = await httpClient.post("/user/edit-preferrence", userInfo);
    return res.data;
  } catch (err) {
    console.error("Edit Account Preferrence Failed:", err);
    throw err;
  }
};

export const userAddLibrary = async (LibraryInfo: {
  book_id: number,
  status: string,
  price: number,
  allow_offers: boolean,
}) => {
  try {
    console.log(LibraryInfo)
    const res = await httpClient.post("/user/add-library", LibraryInfo);
    return res.data;
  } catch (err) {
    console.error("Add book Failed:", err);
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
    console.log("Fetching user profile...");
    const res = await httpClient.get(`user/book-is-in-wishlist/${bookID}`);
    console.log("user is_in_wishlist :", res.data.in_wishlist)
    return res.data.in_wishlist
  } catch (err) {
    console.log("Get user init wishlist unsuccessfully !")
    return null
  }
};

export const MyLibrary = async () => {
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

export const MyListing = async () => {
  try {
    console.log("Fetching user library...");
    const res = await httpClient.get("user/get-listing");
    console.log("user listing :", res.data.listing)
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
    console.log("user listing :", res.data.wishlist)
    return res.data.wishlist
  } catch (err) {
    console.log("Get user wishlist unsuccessfully !")
    return null
  }
};
