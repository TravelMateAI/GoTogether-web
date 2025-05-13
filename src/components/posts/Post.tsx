"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { cn, formatRelativeDate } from "@/lib/utils";
import { MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Comments from "../comments/Comments";
import Linkify from "../Linkify";
import UserAvatar from "../UserAvatar";
import UserTooltip from "../UserTooltip";
import BookmarkButton from "./BookmarkButton";
import LikeButton from "./LikeButton";
import ReactionButtonGroup from "./ReactionButtonGroup"
import PostMoreButton from "./PostMoreButton";
import { FollowerInfo, UserData } from "@/lib/types";

export interface Post {
  postId: string;
  caption: string | null;
  createdAt: string;
  user: UserData;
  attachments: {
    id: string;
    url: string;
    type: "IMAGE" | "VIDEO";
  }[];
  comments: any[];
  reactionCounts: Record<string, number>;
  reactions: { userId: string }[];
  _count: {
    likes: number;
    comments: number;
  };
  bookmarks?: { userId: string }[];
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const { user } = useSession();
  const [showComments, setShowComments] = useState(false);
  // console.log("Post1 :",post);

  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <UserTooltip user={post.user}>
            <Link href={`/users/${post.user.username}`}>
              <UserAvatar avatarUrl={post.user.avatarUrl} />
            </Link>
          </UserTooltip>
          <div>
            <UserTooltip user={post.user}>
              <Link
                href={`/users/${post.user.username}`}
                className="block font-medium hover:underline"
              >
                {post.user.displayName ?? post.user.username}
              </Link>
            </UserTooltip>
            <Link
              href={`/posts/${post.postId}`}
              className="block text-sm text-muted-foreground hover:underline"
              suppressHydrationWarning
            >
              {formatRelativeDate(new Date(post.createdAt))}

            </Link>
          </div>
        </div>
        {post.user.id === user.id && (
          <PostMoreButton
            post={post}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        )}
      </div>
      <Linkify>
        <div className="whitespace-pre-line break-words">{post.caption}</div>
      </Linkify>
      {!!post.attachments?.length && (
        <MediaPreviews attachments={post.attachments} />
      )}
      <hr className="text-muted-foreground" />
      <div className="flex justify-between gap-5">
        <div className="flex items-center gap-5">
        <ReactionButtonGroup postId={post.postId} />

          <CommentButton
            post={post}
            onClick={() => setShowComments(!showComments)}
          />
        </div>
        <BookmarkButton
          postId={post.postId}
          initialState={{
            isBookmarkedByUser:
              post.bookmarks?.some((b) => b.userId === user.id) ?? false,
          }}
        />
      </div>
      {showComments && <Comments post={post} />}
    </article>
  );
}

interface MediaPreviewProps {
  media: {
    id: string;
    url: string;
    type: "IMAGE" | "VIDEO";
  };
}

function MediaPreviews({ attachments }: { attachments: MediaPreviewProps["media"][] }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2"
      )}
    >
      {attachments.map((m) => (
        <MediaPreview key={m.id} media={m} />
      ))}
    </div>
  );
}

function MediaPreview({ media }: MediaPreviewProps) {
  if (media.type === "IMAGE") {
    return (
      <Image
        src={media.url}
        alt="Attachment"
        width={500}
        height={500}
        className="mx-auto size-fit max-h-[30rem] rounded-2xl"
      />
    );
  }

  if (media.type === "VIDEO") {
    return (
      <video
        src={media.url}
        controls
        className="mx-auto size-fit max-h-[30rem] rounded-2xl"
      />
    );
  }

  return <p className="text-destructive">Unsupported media type</p>;
}

interface CommentButtonProps {
  post: Post;
  onClick: () => void;
}

function CommentButton({ post, onClick }: CommentButtonProps) {
  // console.log("Post 2 :",post);
  return (
    <button onClick={onClick} className="flex items-center gap-2">
      <MessageSquare className="size-5" />
      <span className="text-sm font-medium tabular-nums">
        {post._count?.comments ?? 0}
        <span className="hidden sm:inline"> comments</span>
      </span>
    </button>
  );
}
