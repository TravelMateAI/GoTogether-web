import { useSession } from "@/app/(main)/SessionProvider";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { submitPost, updatePost } from "./actions";

export function useSubmitPostMutation() {
  const { toast } = useToast();
  const { user } = useSession();

  const mutation = useMutation({
    mutationFn: async ({
      caption,
      mediaIds,
    }: {
      caption: string;
      mediaIds: string[];
    }) => {
      if (!user || !user.email) {
        throw new Error("Unauthorized: missing user or email");
      }

      return submitPost({ caption, email: user.email, mediaIds });
    },

    onSuccess: () => {
      toast({ description: "Post created successfully!" });
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to create post.",
      });
    },
  });

  return mutation;
}

export function useUpdatePostMutation() {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async ({
      postId,
      caption,
    }: {
      postId: string;
      caption: string;
    }) => {
      return updatePost({ postId, caption });
    },
    onSuccess: () => {
      toast({ description: "Post updated successfully!" });
    },
    onError: (error) => {
      console.error(error);
      toast({ variant: "destructive", description: "Failed to update post." });
    },
  });

  return mutation;
}
