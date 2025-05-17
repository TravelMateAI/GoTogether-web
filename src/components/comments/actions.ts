"use server";

import { validateRequestServer } from "@/auth";
import kyInstance from "@/lib/ky";
import { CommentData, PostData } from "@/lib/types";
import { createCommentSchema } from "@/lib/validation";


export async function submitComment({
  post,
  content,
}: {
  post: PostData;
  content: string;
}): Promise<CommentData> {
  const { user } = await validateRequestServer();

  console.log("Post User : ",user);

  if (!user) throw new Error("Unauthorized");

  const { content: contentValidated } = createCommentSchema.parse({ content });

  const response = await kyInstance.post(`api/posts/${post.postId}/comment`, {
    json: {
      userId: user.userId,
      content: contentValidated,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to post comment");
  }

  console.log("Resp :",response);

  const createdComment: CommentData = await response.json();
  return createdComment;
}


export async function deleteComment(commentId: string) {
  const { user } = await validateRequestServer();

  console.log("comment id :",commentId);

  if (!user) throw new Error("Unauthorized");

  const response = await kyInstance.delete(`api/posts/comments/${commentId}`, {
    searchParams: { userId: user.userId }, // 👈 must match what Spring expects
  });

  if (!response.ok) {
    throw new Error("Failed to delete comment");
  }

  return {
    success: true,
    id: commentId,
    postId: response.headers.get("X-Post-Id") ?? "", // optional
  };
}
