import { useSession } from "@/app/(main)/SessionProvider"; // ✅ Import session hook
import kyInstance from "@/lib/ky";
import { BookmarkInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { use } from "react";

interface BookmarkButtonProps {
  postId: string;
  initialState: BookmarkInfo;
}

export default function BookmarkButton({
  postId,
  initialState,
}: BookmarkButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useSession();
  
  console.log("user : ",user);

  const queryKey: QueryKey = ["bookmark-info", postId];

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance
        .get(`api/posts/${postId}/bookmark?userId=${user.userId}`)
        .json<BookmarkInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  console.log("Data : ",data);

  const { mutate } = useMutation({
    mutationFn: () =>
      data?.isBookmarkedByUser
        ? kyInstance.delete(`api/posts/${postId}/bookmark?userId=${user.userId}`)
        : kyInstance.post(`api/posts/${postId}/bookmark?userId=${user.userId}`),

    onMutate: async () => {
      toast({
        description: `Post ${data?.isBookmarkedByUser ? "un" : ""}bookmarked`,
      });

      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey);

      queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
        isBookmarkedByUser: !previousState?.isBookmarkedByUser,
      }));

      return { previousState };
    },

    onError(error, _vars, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    },
  });

  return (
    <button onClick={() => mutate()} className="flex items-center gap-2">
      <Bookmark
        className={cn(
          "size-5",
          data.isBookmarkedByUser && 
          "fill-primary text-primary"
        )}
      />
    </button>
  );
}
