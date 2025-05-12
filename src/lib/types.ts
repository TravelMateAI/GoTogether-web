// lib/types.ts

// ========== USER ==========

export interface Follower {
  followerId: string;
}

export interface Following {
  userId: string;
}

export interface UserData {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string | null;
  bio?: string | null;
  createdAt: string;
  posts?: PostData[];
  followers?: Follower[];
  following?: Following[];
  _count?: {
    posts: number;
    followers: number;
  };
}

export interface PostData {
  postId: string;
  caption: string | null;
  createdAt: string;
  user: UserData
  attachments: {
    id: string;
    url: string;
    type: "IMAGE" | "VIDEO";
  }[];
  comments: any[];
  reactionCounts: Record<string, number>;
  reactions: { userId: string }[];
  _count: {
    likes: number;
    comments: number;
  };
  bookmarks?: { userId: string }[];
}

export interface PostsPage {
  posts: PostData[];
  nextCursor: string | null;
}


// ========== COMMENT ==========

export interface CommentData {
  id: string;
  content: string;
  createdAt: string;
  postId: string;
  user: UserData;
}

export interface CommentsPage {
  comments: CommentData[];
  previousCursor: string | null;
}

// ========== NOTIFICATION ==========

export type NotificationType = "LIKE" | "FOLLOW" | "COMMENT" | "MENTION"; // adjust as needed

export interface NotificationData {
  id: string;
  type: NotificationType;
  createdAt: string;
  isRead: boolean;
  issuer: {
    username: string;
    displayName: string;
    avatarUrl?: string | null;
  };
  post?: {
    id: string;
    content: string;
  };
}

export interface NotificationsPage {
  notifications: NotificationData[];
  nextCursor: string | null;
}

// ========== UI-Specific COUNT INFO ==========

export interface FollowerInfo {
  followers: number;
  isFollowedByUser: boolean;
}

export interface LikeInfo {
  likes: number;
  isLikedByUser: boolean;
}

export interface BookmarkInfo {
  isBookmarkedByUser: boolean;
}

export interface NotificationCountInfo {
  unreadCount: number;
}

export interface MessageCountInfo {
  unreadCount: number;
}

export type ReactionType = "LIKE" | "LOVE" | "HAHA" | "WOW" | "SAD" | "ANGRY";

export type ReactionCounts = {
  [key in ReactionType]?: number;
};
