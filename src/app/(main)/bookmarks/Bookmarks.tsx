"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

// Import your session/user context hook to get the logged-in user
import { useSession } from "@/app/(main)/SessionProvider"; // Adjust path as needed
// import { error } from "console";

export default function Bookmarks() {
  // Get the logged-in user (adjust as per your project)
  const { user } = useSession();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "bookmarks", user?.userId],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get("api/posts/bookmarked", {
          searchParams: {
            userId: user?.userId, // Always include userId!
            ...(pageParam ? { cursor: pageParam } : {}),
            size: 10, // Optionally customize page size
          },
        })
        .json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!user?.userId, // Only run query when user is available
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        You don&apos;t have any bookmarks yet.
      </p>
    );
  }

  if (status === "error") {
    console.log("Bookmark Error : ", error);
    return (
      <p className="text-center text-destructive">
        An error2 occurred while loading bookmarks.
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
