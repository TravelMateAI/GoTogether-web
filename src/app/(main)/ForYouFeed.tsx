"use client";

import React from "react";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

type Post = {
  postId: string;
  caption: string | null;
  createdAt: string;
  user: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
  attachments: {
    id: string;
    url: string;
    type: "IMAGE" | "VIDEO";
  }[];
  comments: any[];
  reactionCounts: Record<string, number>;
};


type PostsPage = {
  posts: Post[];
  nextCursor: string | null;
};

export default function ForYouFeed() {
  const {
    data,
    error, 
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "for-you"],
    queryFn: async ({ pageParam = "" }) => {
      const res = await kyInstance.get("api/posts/for-you", {
        searchParams: pageParam
          ? { cursor: pageParam, size: 10 }
          : { size: 10 },
      });
      return res.json<PostsPage>();
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? "",
  });
  
  
  console.log(data);

  // ✅ FIX: explicitly tell TypeScript this is an array of pages
  const posts: Post[] = data?.pages?.flatMap((page) => page.posts) ?? [];
  console.log(posts);

  if (status === "pending") return <PostsLoadingSkeleton />;

  if (status === "error") {
    console.error("❌ Error loading posts:", error);
    return (
      <p className="text-center text-destructive">
        An error2 occurred while loading posts.
      </p>
    );
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        No one has posted anything yet.
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {posts.map((post) => (
        <Post key={post.postId} post={post} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}
