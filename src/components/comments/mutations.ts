import { CommentsPage, CommentData } from "@/lib/types";
import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";
import { deleteComment, submitComment } from "./actions";

export function useSubmitCommentMutation(postId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitComment,
    onSuccess: async (newComment: CommentData) => {
      const queryKey: QueryKey = ["comments", postId];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
        queryKey,
        (oldData) => {
          if (!oldData) return;

          const firstPage = oldData.pages[0];
          return {
            pageParams: oldData.pageParams,
            pages: [
              {
                previousCursor: firstPage.previousCursor,
                comments: [...firstPage.comments, newComment],
              },
              ...oldData.pages.slice(1),
            ],
          };
        }
      );

      toast({ description: "Comment created" });
    },
    onError(error) {
      console.error("comment Error :",error);
      toast({
        variant: "destructive",
        description: "Failed to submit comment. Please try again.",
      });
    },
  });
}

export function useDeleteCommentMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: async ({
      id,
      postId,
    }: {
      id: string;
      postId: string;
    }) => {
      const queryKey: QueryKey = ["comments", postId];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
        queryKey,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              previousCursor: page.previousCursor,
              comments: page.comments.filter((c) => c.commentId !== id),
            })),
          };
        }
      );

      toast({ description: "Comment deleted" });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to delete comment. Please try again.",
      });
    },
  });
}
