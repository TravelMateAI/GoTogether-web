"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import kyInstance from "@/lib/ky";
import { ReactionCounts, ReactionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";
import {
  Heart,
  Laugh,
  ThumbsUp,
  Smile,
  Frown,
  Angry,
} from "lucide-react";
import { useState, useRef } from "react";

// Map icons to types
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
}

export default function ReactionButton({ postId }: Props) {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showReactions, setShowReactions] = useState(false);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const [selected, setSelected] = useState<ReactionType | null>(null);

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

  const selectedReaction = reactionIcons.find(r => r.type === selected);

  const totalReactions = Object.values(reactionData ?? {}).reduce(
    (sum, count) => sum + (count || 0),
    0
  );

  const summary = Object.entries(reactionData ?? {})
    .filter(([_, count]) => count && count > 0)
    .map(([type, count]) => {
        const Icon = reactionIcons.find(r => r.type === type)?.Icon;
        return Icon ? (
          <span key={type} className="flex items-center gap-1">
            <Icon className="size-4" /> {count}
          </span>
        ) : null;
      });
      

  return (
    <div
      className="relative flex items-center gap-2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => mutation.mutate("LIKE")}
        className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-md transition-all",
          selectedReaction?.color ?? "text-muted-foreground"
        )}
      >
        {selectedReaction ? (
          <>
            <selectedReaction.Icon className="size-5" />
            <span className="text-sm font-medium">{selectedReaction.type}</span>
          </>
        ) : (
          <>
            <ThumbsUp className="size-5 text-muted-foreground" />
            <span className="text-sm font-medium">Like</span>
          </>
        )}
      </button>

      {showReactions && (
        <div
          className="absolute -top-12 left-0 z-10 flex gap-2 rounded-full bg-white px-2 py-1 shadow-lg border"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {reactionIcons.map(({ type, Icon, color }) => (
            <button
              key={type}
              onClick={() => mutation.mutate(type)}
              className={cn(
                "p-1 hover:scale-125 transition-transform rounded-full",
                color
              )}
              title={type}
            >
              <Icon className="size-5" />
            </button>
          ))}
        </div>
      )}

      {/* Summary below button */}
      {/* {summary.length > 0 && (
        <div className="ml-2 flex items-center gap-2 text-sm text-muted-foreground">
          {summary}
          {totalReactions > 0 && (
            <span className="text-xs font-medium">({totalReactions})</span>
          )}
        </div>
      )} */}
    </div>
  );
}
