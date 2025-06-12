import { useToast } from "@/components/ui/use-toast";
import { PostsPage } from "@/lib/types";
import { useUploadThing } from "@/lib/uploadthing";
import { UpdateUserProfileValues } from "@/lib/validation";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "./actions";

export function useUpdateProfileMutation() {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { startUpload: startAvatarUpload } = useUploadThing("avatar");

  const mutation = useMutation({
    mutationFn: async ({
      values,
      avatar,
    }: {
      values: UpdateUserProfileValues;
      avatar?: File;
    }) => {
      const [initialUpdate, uploadResult] = await Promise.all([
        updateUserProfile(values), // 🔁 First update without avatar
        avatar ? startAvatarUpload([avatar]) : Promise.resolve(undefined),
      ]);

      const avatarUrl = uploadResult?.[0]?.serverData?.avatarUrl;

      const finalUser = avatarUrl
        ? await updateUserProfile({ ...values, avatarUrl }) // 🔁 Second update if avatar was uploaded
        : initialUpdate;

      return {
        ...finalUser,
        avatarUrl: avatarUrl || finalUser.avatarUrl,
      };
    },

    onSuccess: async (updatedUser) => {
      const queryFilter: QueryFilters<
        InfiniteData<PostsPage, string | null>,
        Error,
        InfiniteData<PostsPage, string | null>,
         readonly unknown[]
      > = {
        queryKey: ["post-feed"],
      };

      await queryClient.cancelQueries(queryFilter);

      // queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
      //   queryFilter,
      //   (oldData) => {
      //     if (!oldData) return;

      //     return {
      //       pageParams: oldData.pageParams,
      //       pages: oldData.pages.map((page) => ({
      //         nextCursor: page.nextCursor,
      //         posts: (page.posts ?? []).map((post) => {
      //           if (post.user.id === updatedUser.id) {
      //             return {
      //               ...post,
      //               user: {
      //                 ...updatedUser,
      //               },
      //             };
      //           }
      //           return post;
      //         }),
      //       })),            
      //     };
      //   },
      // );

      router.refresh();

      toast({
        description: "Profile updated",
      });
    },

    onError(error) {
      console.error("error",error);
      toast({
        variant: "destructive",
        description: "Failed to update profile. Please try again.",
      });
    },
  });

  return mutation;
}
