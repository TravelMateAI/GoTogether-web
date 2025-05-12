// lib/getSession.ts
"use server";

import { cookies } from "next/headers";
import { SessionContext } from "../app/(main)/SessionProvider";

export async function getSession(): Promise<SessionContext | null> {
  const cookieStore = cookies();

  const accessToken = cookieStore.get("access_token")?.value;
  const userRaw = cookieStore.get("user")?.value;

  // console.log("accessToken",accessToken);
  // console.log("userRaw",userRaw);

  if (!accessToken || !userRaw) {
    return null;
  }

  try {
    const user = JSON.parse(userRaw);
    return {
      user,
      token: accessToken,
    };
  } catch {
    return null;
  }
}
