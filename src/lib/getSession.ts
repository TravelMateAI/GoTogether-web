"use server";

import { cookies } from "next/headers";
import { SessionContext } from "../app/(main)/SessionProvider";
import { decodeUser } from "@/auth";

export async function getSession(): Promise<SessionContext | null> {
  const cookieStore = cookies();

  const accessToken = cookieStore.get("access_token")?.value;
  const userRaw = cookieStore.get("user")?.value;

  console.log("accessToken", accessToken);
  console.log("userRaw", userRaw);

  if (!accessToken || !userRaw) {
    return null;
  }

  const user = decodeUser(userRaw);
  console.log("user : ", user);
  if (!user) return null;

  return {
    user,
    token: accessToken,
  };
}
