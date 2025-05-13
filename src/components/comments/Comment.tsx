import { useSession } from "@/app/(main)/SessionProvider";
import { CommentData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import UserTooltip from "../UserTooltip";
import CommentMoreButton from "./CommentMoreButton";

interface CommentProps {
  comment: CommentData;
}

interface CommentDTO {
  commentId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export default function Comment({ comment }: CommentProps) {
  const { user } = useSession();

  // console.log(user);
  // console.log(comment.user.id);

  const isAuthor = comment.user.id === user.userId;
  const username = comment.user.username || "unknown";
  const displayName = comment.user.displayName || username;

  return (
    <div className="group/comment flex items-start gap-3 py-3">
      {/* Avatar */}
      <div className="hidden sm:block">
        <UserTooltip user={comment.user}>
          <Link href={`/users/${username}`}>
            <UserAvatar avatarUrl={comment.user.avatarUrl} size={40} />
          </Link>
        </UserTooltip>
      </div>

      {/* Comment Body */}
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm">
          <UserTooltip user={comment.user}>
            <Link
              href={`/users/${username}`}
              className="font-medium hover:underline"
            >
              {displayName}
            </Link>
          </UserTooltip>
          <span className="text-xs text-muted-foreground">
          {formatRelativeDate(new Date(comment.createdAt))}

          </span>
        </div>
        <div className="mt-1 text-sm whitespace-pre-line break-words">
          {comment.content}
        </div>
      </div>

      {/* More Options */}
      {isAuthor && (
        <CommentMoreButton
          comment={comment}
          className="ms-auto opacity-0 transition-opacity group-hover/comment:opacity-100"
        />
      )}
    </div>
  );
}
