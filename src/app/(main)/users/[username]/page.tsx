// "use client";

import { validateRequestServer } from "@/auth";

import FollowButton from "@/components/FollowButton";
import FollowerCount from "@/components/FollowerCount";
import Linkify from "@/components/Linkify";
import TrendsSidebar from "@/components/TrendsSidebar";
import UserAvatar from "@/components/UserAvatar";
import { FollowerInfo, UserData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import EditProfileButton from "./EditProfileButton";
import UserPosts from "./UserPosts";

interface PageProps {
  params: { username: string };
}

const getUser = cache(async (username: string, viewerId: string): Promise<UserData> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/username/${username}`, {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  // console.log(res);
  if (!res.ok) {
    console.error("Failed to fetch user", res.status);
    notFound();
  }

  // console.log(res);

  const user = await res.json();

  if (!user || !user.userId) {
    console.error("Invalid user payload", user);
    notFound();
  }

  return {
    id: user.userId, // ✅ map userId to expected id field
    username: user.username,
    displayName: `${user.firstName} ${user.lastName}`.trim(),
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    createdAt: user.createdAt ?? new Date().toISOString(),
    followers: user.followers,
    following: user.following,
    posts: user.posts,
    _count: {
      followers: user.followers?.length ?? 0,
      posts: user.posts?.length ?? 0,
    },
  };
});


export async function generateMetadata({ params: { username } }: PageProps): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequestServer();

  if (!loggedInUser) return {};

  const user = await getUser(username, loggedInUser.id);
  return {
    title: `${user.displayName} (@${user.username})`,
  };
}

export default async function Page({ params: { username } }: PageProps) {
  const { user: loggedInUser } = await validateRequestServer();

  console.log("Logged User : ",loggedInUser);

  if (!loggedInUser) {
    return (
      <p className="text-destructive">
        You&apos;re not authorized to view this page.
      </p>
    );
  }

  const user = await getUser(username, loggedInUser.userId);
  console.log("User : ",user);
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserId={loggedInUser.userId} />
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold">
            {user.displayName}&apos;s posts
          </h2>
        </div>
        <UserPosts userId={user.id} />
      </div>
      <TrendsSidebar />
    </main>
  );
}

interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  const followerInfo: FollowerInfo = {
    followers: user.followers?.length ?? 0,
    isFollowedByUser: !!user.followers?.some(
      (f: { followerId: string }) => f.followerId === loggedInUserId,
    ),    
  };

  console.log("User Id :",user.id);
  console.log("Logged user id",loggedInUserId);

  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <UserAvatar
        avatarUrl={user.avatarUrl}
        size={250}
        className="mx-auto size-full max-h-60 max-w-60 rounded-full"
      />
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold">{user.displayName}</h1>
            <div className="text-muted-foreground">@{user.username}</div>
          </div>
          <div>Member since {formatDate(new Date(user.createdAt), "MMM d, yyyy")}</div>
          <div className="flex items-center gap-3">
            <span>
              Posts:{" "}
              <span className="font-semibold">
                {formatNumber(user.posts?.length ?? 0)}
              </span>
            </span>
            <FollowerCount userId={user.id} initialState={followerInfo} />
          </div>
        </div>
        {user.id === loggedInUserId ? (
          <EditProfileButton user={user} />
        ) : (
          <FollowButton userId={user.id} initialState={followerInfo} />
        )}
      </div>
      {user.bio && (
        <>
          <hr />
          <Linkify>
            <div className="overflow-hidden whitespace-pre-line break-words">
              {user.bio}
            </div>
          </Linkify>
        </>
      )}
    </div>
  );
}
