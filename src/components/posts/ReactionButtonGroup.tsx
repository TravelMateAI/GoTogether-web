"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import kyInstance from "@/lib/ky";
import { ReactionCounts, ReactionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";
import { Heart, Laugh, ThumbsUp, Smile, Frown, Angry } from "lucide-react";
import { useState, useRef } from "react";

const reactionIcons: {
  type: ReactionType;
  Icon: React.ElementType;
  color: string;
}[] = [
  { type: "LIKE", Icon: ThumbsUp, color: "text-blue-500" },
  { type: "LOVE", Icon: Heart, color: "text-red-500" },
  { type: "HAHA", Icon: Laugh, color: "text-yellow-500" },
  { type: "WOW", Icon: Smile, color: "text-orange-400" },
  { type: "SAD", Icon: Frown, color: "text-gray-500" },
  { type: "ANGRY", Icon: Angry, color: "text-red-700" },
];

interface Props {
  postId: string;
  initialUserReaction?: ReactionType;
}

export default function ReactionButton({ postId, initialUserReaction }: Props) {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showReactions, setShowReactions] = useState(false);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const [selected, setSelected] = useState<ReactionType | null>(
    initialUserReaction ?? null,
  );

  const queryKey = ["reactions", postId];

  const { data: reactionData } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance.get(`api/posts/${postId}/reactions`).json<ReactionCounts>(),
  });

  const mutation = useMutation({
    mutationFn: (type: ReactionType) =>
      kyInstance.post(`api/posts/${postId}/react`, {
        searchParams: { userId: user.userId, type },
      }),
    onSuccess: (_, type) => {
      setSelected(type);
      queryClient.invalidateQueries({ queryKey });
    },
    onError: () => {
      toast({ variant: "destructive", description: "Failed to react." });
    },
  });

  const handleMouseEnter = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setShowReactions(true);
  };

  const handleMouseLeave = () => {
    hideTimeout.current = setTimeout(() => {
      setShowReactions(false);
    }, 300);
  };

  const selectedReaction = reactionIcons.find((r) => r.type === selected);

  return (
    <div
      className="relative flex flex-col items-start"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Reaction button */}
      <button
        onClick={() => mutation.mutate("LIKE")}
        className={cn(
          "flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium transition-all",
          selectedReaction?.color ?? "text-muted-foreground",
        )}
      >
        {selectedReaction ? (
          <selectedReaction.Icon className="size-5" />
        ) : (
          <ThumbsUp className="size-5 text-muted-foreground" />
        )}
        <span>{selectedReaction?.type ?? "Like"}</span>
      </button>

      {/* Emoji popup */}
      {showReactions && (
        <div className="absolute -top-14 left-0 z-10 flex gap-2 rounded-full border bg-white px-3 py-2 shadow-md">
          {reactionIcons.map(({ type, Icon, color }) => (
            <button
              key={type}
              onClick={() => mutation.mutate(type)}
              className={cn(
                "rounded-full p-1 transition hover:scale-125",
                color,
              )}
              title={type}
            >
              <Icon className="size-5" />
            </button>
          ))}
        </div>
      )}

      {/* Reaction summary */}
      {/* {reactionData && (
        <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
          {Object.entries(reactionData)
            .filter(([_, count]) => count && count > 0)
            .map(([type, count]) => {
              const Icon = reactionIcons.find((r) => r.type === type)?.Icon;
              return (
                <span key={type} className="flex items-center gap-1">
                  <Icon className="size-4" />
                  {count}
                </span>
              );
            })}
        </div>
      )} */}
    </div>
  );
}
