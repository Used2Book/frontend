import uploadClient from "@/lib/upload-client";
import { httpClient } from "@/lib/http-client";
import { Post } from "@/types/post";
import { Comment } from "@/types/comment";
import toast from "react-hot-toast";


// Upload multiple images
export const uploadPostImages = async (images: File[]): Promise<string[]> => {
    const formData = new FormData();
    images.forEach((image) => formData.append("images", image)); // Key "images" for multiple files

    try {
        const res = await uploadClient.post("/user/upload-post-images", formData);
        return res.data.image_urls; // Expecting array of URLs
    } catch (err) {
        console.error("Upload Post Images Failed:", err);
        throw err;
    }
};

// Create a new post
export const createPost = async (
  content: string,
  imageUrls: string[],
  genreId?: number | null,
  bookId?: number | null
): Promise<Post> => {
  const formData = new FormData();
  formData.append("content", content);
  imageUrls.forEach((url) => formData.append("image_urls", url)); // Send as multiple fields
  if (genreId !== undefined && genreId !== null) {
    formData.append("genre_id", String(genreId));
  }
  if (bookId !== undefined && bookId !== null) {
    formData.append("book_id", String(bookId));
  }

  try {
    const res = await uploadClient.post("/user/post-create", formData);
    return res.data.post; // Expecting Post object under "post" key
  } catch (err) {
    console.error("Create Post Failed:", err);
    throw err
  }
};


export async function getAllPosts() {
  try {
    const res = await httpClient.get("/user/posts");
    return res.data.posts || []; // ✅ Ensures an empty array instead of `null`
  } catch (error) {
    console.error("Error fetching posts:", error);
    toast.error("error : " + error)
  }
};

export const createComment = async (postId: number, content: string): Promise<Comment> => {
    const formData = new FormData();
    formData.append("post_id", postId.toString());
    formData.append("content", content);

    try {
        const res = await uploadClient.post("/user/comment-create", formData);
        return res.data.comment;
    } catch (err) {
        console.error("Create Comment Failed:", err);
        throw err;
    }
};

export const getCommentsByPostId = async (postId: number): Promise<Comment[]> => {
    try {
        const res = await uploadClient.get(`/user/comments/${postId}`);
        return res.data.comments || [];
    } catch (err) {
        console.error("Get Comments Failed:", err);
        throw err;
    }
};

export const toggleLike = async (postId: number) => {
    try {
        const res = await httpClient.post(`/user/like-toggle/${postId}`);
        return res.data.is_liked;
    } catch (err) {
        console.error("Toggle Like Failed:", err);
        throw err;
    }
};

export const getLikeCount = async (postId: number) => {
    try {
        const res = await httpClient.get(`/user/like-count/${postId}`);
        return res.data.like_count;
    } catch (err) {
        console.error("Get Like Count Failed:", err);
        throw err;
    }
};

export const getLikeStatus = async (postId: number) => {
    try {
        const res = await httpClient.get(`/user/like-check/${postId}`);
        return res.data.is_liked;
    } catch (err) {
        console.error("Get Like Status Failed:", err);
        return false; // Default to false on error
    }
};

export const getPostsByUserID = async (userID: number): Promise<Post[]> => {
    try {
      const res = await uploadClient.get(`/user/user-posts/${userID}`);
      return res.data.posts; // Expecting array of Post objects under "posts" key
    } catch (err) {
      console.error("Get Posts By User ID Failed:", err);
      throw err
    }
  };