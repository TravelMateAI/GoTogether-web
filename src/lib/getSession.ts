"use server";

import { cookies } from "next/headers";
import { SessionContext } from "../app/(main)/SessionProvider";

function decodeUser(encoded: string): SessionContext["user"] | null {
  try {
    console.log("📦 Raw encoded user cookie:", JSON.stringify(encoded));

    // 🔧 Fix: strip surrounding quotes if present
    if (encoded.startsWith('"') && encoded.endsWith('"')) {
      encoded = encoded.slice(1, -1);
      console.log("🧹 Stripped quotes:", encoded);
    }

    console.log("🔎 Raw length:", encoded.length);

    // Step 1: Replace URL-safe Base64 characters
    let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");

    // Step 2: Strip existing padding
    const stripped = base64.replace(/=+$/, "");
    console.log("🚫 After stripping padding:", stripped);

    // Step 3: Add correct padding if needed
    const paddingNeeded = 4 - (stripped.length % 4);
    if (paddingNeeded < 4) {
      base64 = stripped + "=".repeat(paddingNeeded);
      console.log(
        `➕ Added padding: ${"=".repeat(paddingNeeded)} (Final length: ${base64.length})`,
      );
    } else {
      base64 = stripped;
      console.log("✅ No padding needed");
    }

    console.log("🧪 Normalized base64 string:", base64);

    // Step 4: Decode
    const decoded = atob(base64);
    console.log("✅ Decoded JSON string:", decoded);

    const parsed = JSON.parse(decoded);
    console.log("✅ Parsed user object:", parsed);

    return parsed;
  } catch (error) {
    console.error("❌ Failed to decode user cookie:", error);
    return null;
  }
}

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
