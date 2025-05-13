"use server";
"use server";

import { validateRequestServer } from "@/auth";
import kyInstance from "@/lib/ky";

/** Type for a deleted post */
export interface DeletedPost {
  postId: string;
  message: string;
}

export async function deletePost(postId: string): Promise<DeletedPost> {
  const { user } = await validateRequestServer();

  if (!user) throw new Error("Unauthorized");

  const response = await kyInstance.delete(`api/posts/${postId}`, {
    searchParams: { userId: user.userId },
  });

  if (!response.ok) {
    throw new Error("Failed to delete post");
  }

  return await response.json();
}
