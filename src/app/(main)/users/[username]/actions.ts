"use server";

import kyInstance from "@/lib/ky";
import { validateRequestServer } from "@/auth";
import { updateUserProfileSchema, UpdateUserProfileValues } from "@/lib/validation";

import { UserData } from "@/lib/types"; // or wherever your User type is

export async function updateUserProfile(
  values: UpdateUserProfileValues & { avatarUrl?: string }
): Promise<UserData> { 
  const { user } = await validateRequestServer();
  if (!user) throw new Error("Unauthorized");

  const res = await kyInstance.put(`api/users/${user.userId}/profile`, {
    json: {
      displayName: values.displayName,
      bio: values.bio,
      avatarUrl: values.avatarUrl,
    },
  });

  if (!res.ok) throw new Error("Profile update failed");

  return await res.json(); // This will now be typed as UserData
}
