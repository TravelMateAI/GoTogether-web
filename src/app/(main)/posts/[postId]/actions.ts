// lib/actions.ts
// import { getPostDataInclude } from "./types";

export async function fetchPost(postId: string, userId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/${postId}?userId=${userId}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    if (res.status === 404) throw new Error("NotFound");
    throw new Error("Failed to fetch post");
  }

  const post = await res.json();
  return post;
}
