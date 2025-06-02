import * as cookie from "cookie"; // ✅ this works
// ✅ For server components using next/headers
import { cookies } from "next/headers";

export async function getUserInfo(accessToken: string) {
  const response = await fetch(
    "http://localhost:8081/realms/kong/protocol/openid-connect/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) throw new Error("Failed to fetch user info");
  return await response.json();
}

// Shared base64 decoder
function decodeUser(encoded: string) {
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
// 🔐 For server components (RSCs)
export async function validateRequestServer() {
  const cookieStore = cookies();
  const rawUser = cookieStore.get("user")?.value;
  const token = cookieStore.get("access_token")?.value;

  if (!rawUser || !token) return { user: null, token: null };

  const user = decodeUser(rawUser);
  return { user, token };
}

// 🔐 For API routes
export async function validateRequest(req?: { headers?: { cookie?: string } }) {
  const cookieHeader = req?.headers?.cookie ?? "";
  const parsedCookies = cookie.parse(cookieHeader);
  const rawUser = parsedCookies["user"];
  const token = parsedCookies["access_token"];

  if (!rawUser || !token) return { user: null, token: null };

  const user = decodeUser(rawUser);
  return { user, token };
}
