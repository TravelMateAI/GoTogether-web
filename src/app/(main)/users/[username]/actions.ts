"use server";

import { validateRequest } from "@/auth";
import { updateUserProfileSchema, UpdateUserProfileValues } from "@/lib/validation";

export async function updateUserProfile(values: UpdateUserProfileValues) {
  const validatedValues = updateUserProfileSchema.parse(values);

  const { user, token } = await validateRequest();
  if (!user || !token) throw new Error("Unauthorized");

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${user.id}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Optional, for future auth
    },
    body: JSON.stringify(validatedValues),
  });

  if (!res.ok) throw new Error("Failed to update user profile");

  return await res.json();
}
