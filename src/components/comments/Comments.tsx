import kyInstance from "@/lib/ky";
import { PostData } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import Comment from "./Comment";
import CommentInput from "./CommentInput";
import { CommentData } from "@/lib/types";

// export interface CommentDTO {
//   id: string;
//   content: string;
//   createdAt: string;
//   postId: string;
//   user: UserData;
// }

interface PageResponse {
  comments: CommentData[];
  hasNext: boolean;
  nextPage: number;
}

interface CommentsProps {
  post: PostData;
}

export default function Comments({ post }: CommentsProps) {
  // console.log("Post 3 :",post);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["comments", post.postId],
    queryFn: async ({ pageParam = 0 }) => {
      return kyInstance
        .get(`api/posts/${post.postId}/comments`, {
          searchParams: { page: pageParam, size: 5 },
        })
        .json<PageResponse>();
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextPage : undefined,
  });
  // console.log(error);

  // console.log("Data : ",data);

  const comments =
    data?.pages.flatMap((page) => page.comments) || [];

    // console.log("Comments : ",comments);

  return (
    <div className="space-y-3">
      <CommentInput post={post} />
      {hasNextPage && (
        <Button
          variant="link"
          className="mx-auto block"
          disabled={isFetching}
          onClick={() => fetchNextPage()}
        >
          Load previous comments
        </Button>
      )}
      {status === "pending" && <Loader2 className="mx-auto animate-spin" />}
      {status === "success" && !comments.length && (
        <p className="text-center text-muted-foreground">No comments yet.</p>
      )}
      {status === "error" && (
        <p className="text-center text-destructive">
          An error occurred while loading comments.
        </p>
      )}
      <div className="divide-y">
        {comments.map((comment) => (
          <Comment key={comment.commentId} comment={comment} />
        ))}
      </div>
    </div>
  );
}
