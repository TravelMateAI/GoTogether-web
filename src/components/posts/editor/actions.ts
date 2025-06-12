"use server";

import axios from "axios";
import { createPostSchema } from "@/lib/validation";

export async function submitPost(input: {
  caption: string;
  email: string;
  mediaIds: string[];
}) {
  const { caption, email, mediaIds } = createPostSchema.parse(input);

  const response = await axios.post(`http://localhost:8080/api/posts/create`, {
    email,
    caption,
    mediaIds,
  });

  return response.data;
}


export async function updatePost(input: { postId: string; caption: string }) {
  const { postId, caption } = input;

  const response = await axios.put(`http://localhost:8080/api/posts/${postId}`, {
    caption,
  });

  return response.data;
}
