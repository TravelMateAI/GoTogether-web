// app/(main)/posts/[postId]/page.tsx
import { validateRequestServer } from "@/auth";
import { fetchPost } from "./actions";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import PostViewClient from "./PostViewClient";

interface PageProps {
  params: { postId: string };
}

export async function generateMetadata({
  params: { postId },
}: PageProps): Promise<Metadata> {
  const { user } = await validateRequestServer();
  if (!user) return {};

  const post = await fetchPost(postId, user.id).catch((err) => {
    if (err.message === "NotFound") notFound();
    throw err;
  });

  return {
    title: `${post.user.displayName}: ${post.content.slice(0, 50)}...`,
  };
}

export default async function Page({ params: { postId } }: PageProps) {
  const { user } = await validateRequestServer();
  if (!user) {
    return <p className="text-destructive">You&apos;re not authorized to view this page.</p>;
  }

  const post = await fetchPost(postId, user.id).catch((err) => {
    if (err.message === "NotFound") notFound();
    throw err;
  });

  return <PostViewClient post={post} loggedInUserId={user.id} />;
}
