import uploadClient from "@/lib/upload-client";
import { httpClient } from "@/lib/http-client";
import { Post } from "@/types/post";

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
export const createPost = async (content: string, imageUrls: string[]): Promise<Post> => {
    const formData = new FormData();
    formData.append("content", content);
    imageUrls.forEach((url) => formData.append("image_urls", url)); // Send as multiple fields

    try {
        const res = await uploadClient.post("/user/post-create", formData);
        return res.data.post; // Expecting Post object
    } catch (err) {
        console.error("Create Post Failed:", err);
        throw err;
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

import { Comment } from "@/types/comment";

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
        const res = await uploadClient.get(`/user/comments?post_id=${postId}`);
        return res.data.comments;
    } catch (err) {
        console.error("Get Comments Failed:", err);
        throw err;
    }
};