"use client";

import useFollowerInfo from "@/hooks/useFollowerInfo";
import kyInstance from "@/lib/ky";
import { FollowerInfo } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { useSession } from "@/app/(main)/SessionProvider";

interface FollowButtonProps {
  userId: string; // this is the target user ID (to be followed/unfollowed)
  initialState: FollowerInfo;
}

export default function FollowButton({
  userId,
  initialState,
}: FollowButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["follower-info", userId];
  const { user } = useSession(); // logged-in user

  // console.log("new user : ",user);

  const { data } = useFollowerInfo(userId, initialState);

  console.log("data :",data);

  const { mutate, isPending } = useMutation<
    Response,
    Error,
    void,
    { previousState: FollowerInfo | undefined }
  >({
    mutationFn: () => {
      const followerUserId = user.userId;
      const url = `api/users/${userId}/followers?followerUserId=${followerUserId}`;
      console.log("[mutationFn] Request to:", url);

      return data?.isFollowedByUser
        ? kyInstance.delete(url)
        : kyInstance.post(url);
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData<FollowerInfo>(queryKey);

      const optimistic: FollowerInfo = {
        followers:
          (previousState?.followers || 0) +
          (previousState?.isFollowedByUser ? -1 : 1),
        isFollowedByUser: !previousState?.isFollowedByUser,
      };

      queryClient.setQueryData<FollowerInfo>(queryKey, optimistic);

      return { previousState };
    },

    onError(error, _vars, context) {
      console.error("[FollowButton] Mutation error:", error);
      queryClient.setQueryData(queryKey, context?.previousState);
      toast({
        variant: "destructive",
        description: "Something1 went wrong. Please try again.",
      });
    },
  });

  if (!data) return null;

  return (
    <Button
      variant={data.isFollowedByUser ? "secondary" : "default"}
      onClick={() => mutate()}
      disabled={isPending}
    >
      {data.isFollowedByUser ? "Unfollow" : "Follow"}
    </Button>
  );
}
