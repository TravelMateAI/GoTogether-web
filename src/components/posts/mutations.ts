import { PostsPage } from "@/lib/types";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { deletePost } from "./actions";

export function useDeletePostMutation() {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const router = useRouter();
  const pathname = usePathname();

  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: async (deletedPost) => {
      // Explicitly type queryFilter to match the TData used in setQueriesData
      const queryFilter: QueryFilters<InfiniteData<PostsPage, string | null>> = { queryKey: ["post-feed"] };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.filter((p) => p.postId !== deletedPost.postId), // Corrected to postId
            })),
          };
        },
      );

      toast({
        description: "Post deleted",
      });

      if (pathname === `/posts/${deletedPost.postId}`) { // Corrected to postId
        // Ensure deletedPost.user exists and has username, which it should due to updated DeletedPost type
        if (deletedPost.user && deletedPost.user.username) {
          router.push(`/users/${deletedPost.user.username}`);
        }
      }
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to delete post. Please try again.",
      });
    },
  });

  return mutation;
}
