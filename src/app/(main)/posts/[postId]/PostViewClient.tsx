// app/(main)/posts/[postId]/PostViewClient.tsx
"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import Post from "@/components/posts/Post";
import UserInfoSidebar from "./UserInfoSidebar";
import { PostWithUser } from "@/lib/types"; // Define this if not available

interface Props {
  post: PostWithUser;
  loggedInUserId: string;
}

export default function PostViewClient({ post, loggedInUserId }: Props) {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Post post={post} />
      </div>
      <div className="sticky top-[5.25rem] hidden h-fit w-80 flex-none lg:block">
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <UserInfoSidebar user={post.user} loggedInUserId={loggedInUserId} />
        </Suspense>
      </div>
    </main>
  );
}
